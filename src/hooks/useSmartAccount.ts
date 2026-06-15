import { toSimpleSmartAccount } from "permissionless/accounts"
import { useEffect, useState } from "react"
import { createPublicClient, http } from "viem"
import { entryPoint07Address } from "viem/account-abstraction"
import { polygonAmoy } from "viem/chains"
import { useWalletClient } from "wagmi"
import { AMOY_RPC_URL, SIMPLE_ACCOUNT_FACTORY } from "../config"

type SimpleSmartAccount = Awaited<ReturnType<typeof toSimpleSmartAccount>>

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(AMOY_RPC_URL),
})

export function useSmartAccount() {
  const { data: walletClient } = useWalletClient()
  const [smartAccount, setSmartAccount] = useState<SimpleSmartAccount | null>(null)

  useEffect(() => {
    if (!walletClient) {
      setSmartAccount(null)
      return
    }
    toSimpleSmartAccount({
      owner: walletClient,
      client: publicClient,
      entryPoint: { address: entryPoint07Address, version: "0.7" },
      factoryAddress: SIMPLE_ACCOUNT_FACTORY,
    }).then(setSmartAccount)
  }, [walletClient])

  return smartAccount
}
