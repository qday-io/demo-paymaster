import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/ui/button'
import { useAccountBalances } from '../hooks/useAccountBalances'

export const Route = createFileRoute('/connect')({
  component: ConnectPage,
})

function ConnectPage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { isDeployed, isLoading } = useAccountBalances()

  // After connect, redirect based on deployment status
  useEffect(() => {
    if (isConnected && !isLoading) {
      if (isDeployed) {
        navigate({ to: '/app', replace: true })
      } else {
        navigate({ to: '/onboard', replace: true })
      }
    }
  }, [isConnected, isDeployed, isLoading, navigate])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="text-left mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="text-xs text-muted-foreground hover:text-foreground -ml-2"
            >
              ← Go back
            </Button>
          </div>
          <p className="text-lg font-medium">Connect your wallet</p>
          <p className="text-sm text-muted-foreground">
            You chose to use an existing smart account. Connect the EOA that owns it.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => connect({ connector: injected() })}
          >
            Connect Wallet
          </Button>
        </div>
      </main>
    </div>
  )
}
