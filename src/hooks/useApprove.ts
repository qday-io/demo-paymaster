import { createSmartAccountClient } from "permissionless"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { useState } from "react"
import { encodeFunctionData, http, maxUint256, type Address } from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { polygonAmoy } from "viem/chains"
import { BUNDLER_URL, USD8_ADDRESS, USD8_PAYMASTER_ADDRESS } from "../config"
import { useSmartAccount } from "./useSmartAccount"

const APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const

export function useApprove() {
  const smartAccount = useSmartAccount()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function approve() {
    if (!smartAccount) throw new Error("Wallet not connected")
    setIsPending(true)
    setError(null)
    setIsSuccess(false)

    try {
      const bundlerClient = createPimlicoClient({
        transport: http(BUNDLER_URL),
        entryPoint: { address: entryPoint07Address, version: "0.7" },
      })

      const client = createSmartAccountClient({
        account: smartAccount,
        chain: polygonAmoy,
        bundlerTransport: http(BUNDLER_URL),
        userOperation: {
          estimateFeesPerGas: async () =>
            (await bundlerClient.getUserOperationGasPrice()).fast,
        },
      })

      const hash = await client.sendUserOperation({
        calls: [
          {
            to: USD8_ADDRESS as Address,
            data: encodeFunctionData({
              abi: APPROVE_ABI,
              functionName: "approve",
              args: [USD8_PAYMASTER_ADDRESS as Address, maxUint256],
            }),
            value: 0n,
          },
        ],
        verificationGasLimit: 150_000n,
        callGasLimit: 100_000n,
        preVerificationGas: 60_000n,
      })

      await client.waitForUserOperationReceipt({ hash })
      setIsSuccess(true)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  return { approve, isPending, isSuccess, error }
}
