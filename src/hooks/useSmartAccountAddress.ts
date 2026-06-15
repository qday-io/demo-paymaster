import { useAccount, useReadContract } from "wagmi"
import { SIMPLE_ACCOUNT_FACTORY, SIMPLE_ACCOUNT_FACTORY_ABI } from "../config"

export function useSmartAccountAddress() {
  const { address: eoa, isConnected } = useAccount()

  const { data: smartAddress, isLoading } = useReadContract({
    address: SIMPLE_ACCOUNT_FACTORY,
    abi: SIMPLE_ACCOUNT_FACTORY_ABI,
    functionName: "getAddress",
    args: [eoa!, 0n],
    query: { enabled: isConnected && !!eoa },
  })

  return { smartAddress: smartAddress as `0x${string}` | undefined, isLoading }
}
