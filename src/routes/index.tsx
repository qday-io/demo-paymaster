import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { EntryChoice } from '../components/EntryChoice'
import { useAccountBalances } from '../hooks/useAccountBalances'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { isDeployed, isLoading } = useAccountBalances()

  // Auto redirect when already connected (prevent staying on home page)
  useEffect(() => {
    if (isConnected && !isLoading) {
      if (isDeployed) {
        navigate({ to: '/app', replace: true })
      } else {
        navigate({ to: '/onboard', replace: true })
      }
    }
  }, [isConnected, isDeployed, isLoading, navigate])

  // Only show choice UI if not connected
  if (isConnected) {
    return null // Will redirect via effect
  }

  return (
    <EntryChoice
      onCreateNew={() => navigate({ to: '/onboard' })}
      onUseExisting={() => navigate({ to: '/connect' })}
    />
  )
}
