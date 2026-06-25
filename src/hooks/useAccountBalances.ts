import { formatUnits } from "viem"
import { useQuery } from "@tanstack/react-query"
import { useBalance, usePublicClient, useReadContract } from "wagmi"
import {
  PRICE_ORACLE_ABI,
  PRICE_ORACLE_ADDRESS,
  USD8_ABI,
  USD8_ADDRESS,
  USD8_DECIMALS,
  USD8_PAYMASTER_ABI,
  USD8_PAYMASTER_ADDRESS,
  USER_B_ADDRESS,
} from "../config"
import { useSmartAccountAddress } from "./useSmartAccountAddress"

export function useAccountBalances(recipientAddress?: string) {
  const { smartAddress, isLoading: addressLoading } = useSmartAccountAddress()
  const enabled = !!smartAddress

  const { data: polBalance } = useBalance({
    address: smartAddress,
    query: { enabled, refetchInterval: 4000 },
  })

  const { data: usd8BalanceA } = useReadContract({
    address: USD8_ADDRESS,
    abi: USD8_ABI,
    functionName: "balanceOf",
    args: [smartAddress!],
    query: { enabled, refetchInterval: 4000 },
  })

  const recipient = (recipientAddress as `0x${string}` | undefined) ?? USER_B_ADDRESS
  const { data: usd8BalanceB } = useReadContract({
    address: USD8_ADDRESS,
    abi: USD8_ABI,
    functionName: "balanceOf",
    args: [recipient],
    query: { refetchInterval: 4000 },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USD8_ADDRESS,
    abi: USD8_ABI,
    functionName: "allowance",
    args: [smartAddress!, USD8_PAYMASTER_ADDRESS],
    query: { enabled, refetchInterval: 4000 },
  })

  const { data: oraclePriceRaw } = useReadContract({
    address: PRICE_ORACLE_ADDRESS,
    abi: PRICE_ORACLE_ABI,
    functionName: "getPrice",
    query: { refetchInterval: 30_000 },
  })

  const { data: paymasterDeposit } = useReadContract({
    address: USD8_PAYMASTER_ADDRESS,
    abi: USD8_PAYMASTER_ABI,
    functionName: "getDeposit",
    query: { refetchInterval: 30_000 },
  })

  const publicClient = usePublicClient()

  const { data: isDeployed = false, isLoading: isDeployedLoading } = useQuery({
    queryKey: ["isSmartAccountDeployed", smartAddress],
    queryFn: async () => {
      if (!smartAddress || !publicClient) return false
      const code = await publicClient.getBytecode({ address: smartAddress })
      return Boolean(code && code !== "0x")
    },
    enabled: Boolean(smartAddress && publicClient),
    refetchInterval: 4000,
    staleTime: 1000,
  })

  const isApproved = allowance !== undefined && (allowance as bigint) > 0n

  const isLoading = addressLoading || isDeployedLoading

  const oraclePrice = oraclePriceRaw
    ? Number((oraclePriceRaw as [bigint, number])[0]) / 1e8
    : null

  return {
    smartAddress,
    isLoading,
    polBalance: polBalance ? formatUnits(polBalance.value, 18) : null,
    usd8BalanceA: usd8BalanceA ? formatUnits(usd8BalanceA as bigint, USD8_DECIMALS) : null,
    usd8BalanceB: usd8BalanceB ? formatUnits(usd8BalanceB as bigint, USD8_DECIMALS) : null,
    recipientAddress: recipient,
    allowance: allowance as bigint | undefined,
    isApproved,
    isDeployed,
    oraclePrice,
    paymasterDeposit: paymasterDeposit ? formatUnits(paymasterDeposit as bigint, 18) : null,
    refetchAllowance,
  }
}
