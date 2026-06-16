import { useState } from "react"
import { useAccount } from "wagmi"
import { AccountInfo } from "./components/AccountInfo"
import { Header } from "./components/Header"
import { TransactionResult } from "./components/TransactionResult"
import { TransferForm } from "./components/TransferForm"
import { USER_B_ADDRESS } from "./config"
import { useAccountBalances } from "./hooks/useAccountBalances"
import type { TransferResult } from "./hooks/useTransfer"
import { OnboardingPage } from "./pages/OnboardingPage"

export default function App() {
  const { isConnected } = useAccount()
  const { isApproved } = useAccountBalances()
  const [recipient, setRecipient] = useState<string>(USER_B_ADDRESS)
  const [txResult, setTxResult] = useState<TransferResult | null>(null)

  // Onboarding covers: not connected + connected-but-not-yet-approved (incl. loading)
  if (!isConnected || !isApproved) {
    return <OnboardingPage onComplete={() => {}} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
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
