import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { OnboardingPage } from '../pages/OnboardingPage'

export const Route = createFileRoute('/onboard')({
  component: OnboardPage,
})

function OnboardPage() {
  const navigate = useNavigate()

  return (
    <OnboardingPage
      onComplete={() => navigate({ to: '/app' })}
      onGoBack={() => navigate({ to: '/' })}
      onSwitchToExisting={() => navigate({ to: '/connect' })}
    />
  )
}
