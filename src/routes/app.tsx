import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TransferForm } from '../components/TransferForm'
import { FundUsd8Modal } from '../components/FundUsd8Modal'
import { AccountInfo } from '../components/AccountInfo'
import { Button } from '../components/ui/button'
import { ArrowDownToLine } from 'lucide-react'
import { TransactionResult } from '../components/TransactionResult'
import { USER_B_ADDRESS } from '../config'
import { useAccountBalances } from '../hooks/useAccountBalances'
import type { TransferResult } from '../hooks/useTransfer'

export const Route = createFileRoute('/app')({
  component: AppPage,
})

function AppPage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { isApproved, isDeployed } = useAccountBalances()

  const [recipient, setRecipient] = useState<string>(USER_B_ADDRESS)
  const [txResult, setTxResult] = useState<TransferResult | null>(null)
  const [fundModalOpen, setFundModalOpen] = useState(false)

  // Basic guard: if not connected or (not deployed and not approved), redirect appropriately
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/', replace: true })
      return
    }
    if (!isDeployed && !isApproved) {
      // Not ready -> go to onboarding
      navigate({ to: '/onboard', replace: true })
    }
  }, [isConnected, isDeployed, isApproved, navigate])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="mb-2">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-xs text-muted-foreground hover:text-foreground -ml-2"
          >
            ← Go back
          </button>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setFundModalOpen(true)}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Fund USD8
          </Button>
        </div>

        <FundUsd8Modal open={fundModalOpen} onOpenChange={setFundModalOpen} />

        <TransferForm
          recipient={recipient}
          onRecipientChange={setRecipient}
          onSuccess={(result) => setTxResult(result)}
        />
        <AccountInfo recipientAddress={recipient} />
        {txResult && <TransactionResult result={txResult} />}
      </main>
    </div>
  )
}
