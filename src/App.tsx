import { useState } from "react"
import { useAccount } from "wagmi"
import { AccountInfo } from "./components/AccountInfo"
import { Header } from "./components/Header"
import { TransactionResult } from "./components/TransactionResult"
import { TransferForm } from "./components/TransferForm"
import type { TransferResult } from "./hooks/useTransfer"

export default function App() {
  const { isConnected } = useAccount()
  const [txResult, setTxResult] = useState<TransferResult | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {!isConnected && (
          <div className="text-center py-20 space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">USD8 Gasless Transfer Demo</h2>
            <p className="text-muted-foreground">
              Connect your wallet to send USD8 with gas paid entirely in USD8 via ERC-4337.
            </p>
            <p className="text-sm text-muted-foreground">
              Your POL balance will be <span className="font-semibold text-green-600">unchanged</span> after the transfer.
            </p>
          </div>
        )}

        {isConnected && (
          <>
            <AccountInfo />
            <TransferForm onSuccess={(result) => setTxResult(result)} />
            {txResult && (
              <TransactionResult result={txResult} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
