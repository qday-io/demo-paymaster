import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useSmartAccountAddress } from "../hooks/useSmartAccountAddress"
import { AddressDisplay } from "./AddressDisplay"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface HeaderProps {
  showConnect?: boolean
}

export function Header({ showConnect = true }: HeaderProps) {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { mutate: disconnect } = useDisconnect()
  const { smartAddress } = useSmartAccountAddress()

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-bold tracking-tight hover:opacity-80">USD8 Gasless Transfer</a>
          <Badge variant="secondary" className="text-xs">ERC-4337</Badge>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  EOA: <AddressDisplay address={address} className="text-xs" />
                </span>
                {smartAddress && (
                  <span className="text-xs text-muted-foreground">
                    Smart Account: <AddressDisplay address={smartAddress} className="text-xs" />
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">Connected</Badge>
              <Button variant="outline" size="sm" onClick={() => disconnect()}>Disconnect</Button>
            </>
          ) : showConnect ? (
            <Button size="sm" onClick={() => connect({ connector: injected() })}>Connect Wallet</Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
