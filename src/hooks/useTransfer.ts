import { createSmartAccountClient } from "permissionless"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { useState } from "react"
import {
  encodeFunctionData,
  http,
  parseEventLogs,
  parseUnits,
  type Address,
} from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { polygonAmoy } from "viem/chains"
import {
  BUNDLER_URL,
  EXPLORER_URL,
  USD8_ADDRESS,
  USD8_DECIMALS,
  USD8_PAYMASTER_ADDRESS,
} from "../config"
import { useSmartAccount } from "./useSmartAccount"

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const

const PAYMASTER_ABI = [
  {
    name: "UserOperationSponsored",
    type: "event",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "charged", type: "uint256", indexed: false },
      { name: "refunded", type: "uint256", indexed: false },
      { name: "actualGasCost", type: "uint256", indexed: false },
    ],
  },
] as const

export type TransferResult = {
  txHash: `0x${string}`
  explorerUrl: string
  blockNumber: bigint
  amountSent: bigint
  gasCharged: bigint
  refunded: bigint
  actualGasCost: bigint
}

export function useTransfer() {
  const smartAccount = useSmartAccount()
  const [isPending, setIsPending] = useState(false)
  const [result, setResult] = useState<TransferResult | null>(null)
  const [error, setError] = useState<Error | null>(null)

  async function send(to: Address, amountUsd8: string): Promise<TransferResult | null> {
    if (!smartAccount) throw new Error("Wallet not connected")
    setIsPending(true)
    setResult(null)
    setError(null)

    try {
      const amount = parseUnits(amountUsd8, USD8_DECIMALS)

      const bundlerClient = createPimlicoClient({
        transport: http(BUNDLER_URL),
        entryPoint: { address: entryPoint07Address, version: "0.7" },
      })

      const client = createSmartAccountClient({
        account: smartAccount,
        chain: polygonAmoy,
        bundlerTransport: http(BUNDLER_URL),
        paymaster: {
          async getPaymasterStubData(_parameters) {
            return {
              paymaster: USD8_PAYMASTER_ADDRESS as Address,
              paymasterData: "0x" as `0x${string}`,
              paymasterVerificationGasLimit: 200_000n,
              paymasterPostOpGasLimit: 100_000n,
            }
          },
          async getPaymasterData(_parameters) {
            return {
              paymaster: USD8_PAYMASTER_ADDRESS as Address,
              paymasterData: "0x" as `0x${string}`,
            }
          },
        },
        userOperation: {
          estimateFeesPerGas: async () =>
            (await bundlerClient.getUserOperationGasPrice()).fast,
        },
      })

      const userOpHash = await client.sendUserOperation({
        calls: [
          {
            to: USD8_ADDRESS as Address,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: "transfer",
              args: [to, amount],
            }),
            value: 0n,
          },
        ],
        verificationGasLimit: 150_000n,
        callGasLimit: 150_000n,
        preVerificationGas: 60_000n,
      })

      const receipt = await client.waitForUserOperationReceipt({ hash: userOpHash })
      const { transactionHash: txHash, blockNumber, logs } = receipt.receipt

      const transferLogs = parseEventLogs({ abi: ERC20_ABI, logs, eventName: "Transfer" })
      const sponsoredLog = parseEventLogs({
        abi: PAYMASTER_ABI,
        logs,
        eventName: "UserOperationSponsored",
      })[0]

      const transferToB = transferLogs.find(
        (l) => l.args.to?.toLowerCase() === to.toLowerCase()
      )

      const transferResult: TransferResult = {
        txHash,
        explorerUrl: `${EXPLORER_URL}/tx/${txHash}`,
        blockNumber,
        amountSent: transferToB?.args.value ?? amount,
        gasCharged: sponsoredLog?.args.charged ?? 0n,
        refunded: sponsoredLog?.args.refunded ?? 0n,
        actualGasCost: sponsoredLog?.args.actualGasCost ?? 0n,
      }

      setResult(transferResult)
      return transferResult
    } catch (e) {
      setError(e as Error)
      return null
    } finally {
      setIsPending(false)
    }
  }

  return { send, isPending, result, error }
}
