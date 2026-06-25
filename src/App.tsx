import { useEffect, useState } from "react"
import { useAccount, useConnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { AccountInfo } from "./components/AccountInfo"
import { Button } from "./components/ui/button"
import { EntryChoice } from "./components/EntryChoice"
import { Header } from "./components/Header"
import { TransactionResult } from "./components/TransactionResult"
import { TransferForm } from "./components/TransferForm"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { USER_B_ADDRESS } from "./config"
import { useAccountBalances } from "./hooks/useAccountBalances"
import type { TransferResult } from "./hooks/useTransfer"
import { OnboardingPage } from "./pages/OnboardingPage"

type SetupIntent = "undecided" | "create" | "existing"

export default function App() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { isApproved, isDeployed, isLoading: balancesLoading } = useAccountBalances()

  const [intent, setIntent] = useState<SetupIntent>("undecided")
  const [recipient, setRecipient] = useState<string>(USER_B_ADDRESS)
  const [txResult, setTxResult] = useState<TransferResult | null>(null)

  // When the user disconnects, bring them back to the choice screen
  useEffect(() => {
    if (!isConnected) {
      setIntent("undecided")
    }
  }, [isConnected])

  // === Path 1: Explicit "Create new Smart Account" flow ===
  // Full guided wizard with POL bootstrap + first-time deployment + approve.
  if (intent === "create") {
    return (
      <OnboardingPage
        onComplete={() => {
          // User finished the wizard (clicked "Open App" after approval).
          // Clear intent so next disconnect shows clean choice again.
          setIntent("undecided")
        }}
        onSwitchToExisting={() => setIntent("existing")}
        onGoBack={() => setIntent("undecided")}
      />
    )
  }

  // Auto-route when wallet is already connected (prevent staying on home/choice page)
  // Only for undecided (no explicit choice made): 
  // - not deployed → onboarding / create guided flow
  // - deployed → will go to main below
  if (isConnected && intent === "undecided" && !isDeployed) {
    return (
      <OnboardingPage
        onComplete={() => setIntent("undecided")}
        onGoBack={() => setIntent("undecided")}
        onSwitchToExisting={() => setIntent("existing")}
      />
    )
  }

  if (intent === "undecided") {
    if (!isConnected) {
      return (
        <EntryChoice
          onCreateNew={() => setIntent("create")}
          onUseExisting={() => {
            setIntent("existing")
            if (!isConnected) {
              connect({ connector: injected() })
            }
          }}
        />
      )
    }
    // connected + undecided + deployed ( !deployed was caught above ) → fall to main
  }

  // === Not connected yet ===
  if (!isConnected) {
    if (intent === "existing") {
      // User chose "I already have" → show a lightweight connect screen
      // (we auto-triggered connect from EntryChoice, but if it didn't or they came back)
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <Header showConnect={false} />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-sm w-full text-center space-y-4">
              <div className="text-left mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIntent("undecided")}
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

    // Default: show the two-path choice screen
    return (
      <EntryChoice
        onCreateNew={() => setIntent("create")}
        onUseExisting={() => {
          setIntent("existing")
          // Trigger connect immediately for a smooth "connect wallet" experience
          connect({ connector: injected() })
        }}
      />
    )
  }

  // (removed old post-connect decision screen for existing + !deployed)
  // Now handled by the auto-route above: connected + !deployed → directly onboarding

  // === Connected ===
  // - isConnected && isDeployed → main transfer screen (auto from undecided too)
  // - "existing" intent + (deployed or force) → main
  // - isApproved → main (full gasless ready)
  if (isConnected && isDeployed || intent === "existing" || isApproved) {
    const showNotDeployedWarning = intent === "existing" && !isDeployed && !balancesLoading

    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <div className="-mt-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIntent("undecided")}
              className="text-xs text-muted-foreground hover:text-foreground -ml-2"
            >
              ← Go back
            </Button>
          </div>

          {showNotDeployedWarning && (
            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <AlertTitle className="text-amber-700 dark:text-amber-400">
                Smart account not deployed yet
              </AlertTitle>
              <AlertDescription className="text-amber-700/90 dark:text-amber-400/90 space-y-2">
                <p>
                  The smart account for this wallet has not been created on-chain yet. 
                  The first transaction will deploy it using the factory.
                </p>
                <p className="text-xs">
                  You will likely need to send a small amount of POL directly to the Smart Account 
                  address (for the deployment prefund). After deployment + paymaster approval, 
                  everything becomes gasless.
                </p>
                <div className="pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIntent("create")}
                  >
                    Switch to guided setup (fund + activate)
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

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

  // Fallback (connected but no approval and not in "existing" mode) → send to create flow
  return (
    <OnboardingPage
      onComplete={() => setIntent("undecided")}
      onSwitchToExisting={() => setIntent("existing")}
      onGoBack={() => setIntent("undecided")}
    />
  )
}
