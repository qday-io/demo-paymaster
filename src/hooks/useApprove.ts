import { createSmartAccountClient } from "permissionless"
import { useState } from "react"
import { createPublicClient, encodeFunctionData, http, maxUint256, type Address } from "viem"
import { polygonAmoy } from "viem/chains"
import { AMOY_RPC_URL, BUNDLER_URL, USD8_ADDRESS, USD8_PAYMASTER_ADDRESS } from "../config"
import { useSmartAccount } from "./useSmartAccount"

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(AMOY_RPC_URL),
})

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
    setIsPending(true)
    setError(null)
    setIsSuccess(false)

    try {
      if (!smartAccount) throw new Error("Smart account not ready yet — please wait a moment")

      const client = createSmartAccountClient({
        account: smartAccount,
        chain: polygonAmoy,
        bundlerTransport: http(BUNDLER_URL),
        userOperation: {
          estimateFeesPerGas: async () => {
            const fees = await publicClient.estimateFeesPerGas()
            return {
              maxFeePerGas: fees.maxFeePerGas ?? 0n,
              maxPriorityFeePerGas: fees.maxPriorityFeePerGas ?? 0n,
            }
          },
        },
      })

      // verificationGasLimit must cover factory deployment on the first UserOp.
      // 150k covers verification only; factory deploy needs ~300k extra.
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
        verificationGasLimit: 500_000n,
        callGasLimit: 100_000n,
        preVerificationGas: 80_000n,
      })

      await client.waitForUserOperationReceipt({ hash })
      setIsSuccess(true)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  return { approve, isPending, isSuccess, error, isReady: !!smartAccount }
}
