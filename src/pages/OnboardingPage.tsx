import { useAccount, useConnect, useDisconnect, useSendTransaction } from "wagmi"
import { injected } from "wagmi/connectors"
import { parseEther } from "viem"
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { AddressBox } from "../components/AddressDisplay"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { useApprove } from "../hooks/useApprove"
import { cn, formatUserOpError } from "../lib/utils"

// Amount of POL needed to bootstrap (deploy + approve) the smart account.
// Gas limits: 350k + 120k + 60k = 530k total.
// At 100 gwei peak: 530k × 100 gwei = 0.053 POL prefund.
// 0.1 POL covers spikes up to ~188 gwei; unused POL is refunded by EntryPoint.
const POL_BOOTSTRAP = 0.1

type Step = "connect" | "loading" | "fund" | "approve" | "done"

function deriveStep(
  isConnected: boolean,
  isLoading: boolean,
  smartAddress: string | undefined,
  polBalance: string | null,
  isApproved: boolean,
): Step {
  if (!isConnected) return "connect"
  if (isLoading || !smartAddress) return "loading"
  if (isApproved) return "done"
  if (polBalance === null || parseFloat(polBalance) < POL_BOOTSTRAP) return "fund"
  return "approve"
}

const STEP_ORDER: Step[] = ["connect", "fund", "approve", "done"]

function stepIndex(step: Step) {
  const s = step === "loading" ? "connect" : step
  return STEP_ORDER.indexOf(s)
}

function ProgressDots({ current }: { current: Step }) {
  const labels = ["Connect", "Bootstrap", "Activate", "Ready"]
  const ci = stepIndex(current)
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i < ci ? "w-4 bg-green-600" :
                i === ci ? "w-6 bg-primary" :
                "w-2 bg-muted-foreground/25",
              )}
            />
            <span className={cn(
              "text-[10px] font-medium",
              i === ci ? "text-primary" : "text-muted-foreground/50",
            )}>
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className={cn(
              "h-px w-6 mb-4 transition-colors duration-300",
              i < ci ? "bg-green-600" : "bg-muted-foreground/20",
            )} />
          )}
        </div>
      ))}
    </div>
  )
}


function StepConnect() {
  const { connect } = useConnect()
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Wallet className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Connect your EOA wallet to generate your Smart Account address.
          Your Smart Account is deterministic — it's derived from your wallet and never changes.
        </CardDescription>
      </div>
      <div className="rounded-lg border bg-muted/30 p-4 text-left space-y-2 text-sm text-muted-foreground">
        <p className="font-medium text-foreground text-xs uppercase tracking-wide">What is a Smart Account?</p>
        <p>A programmable wallet powered by ERC-4337. Gas fees are paid in <strong>USD8</strong> — you never need POL for transactions.</p>
      </div>
      <Button className="w-full" onClick={() => connect({ connector: injected() })}>
        Connect Wallet
      </Button>
    </div>
  )
}

function StepLoading() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="space-y-1">
        <p className="font-medium">Setting up your Smart Account</p>
        <p className="text-sm text-muted-foreground">Deriving your account address…</p>
      </div>
    </div>
  )
}

function StepFund({ smartAddress, polBalance }: { smartAddress: string; polBalance: string | null }) {
  const { sendTransaction, isPending: isSending, isSuccess: sentPol } = useSendTransaction()
  const pol = polBalance !== null ? parseFloat(polBalance) : 0
  const hasEnough = pol >= POL_BOOTSTRAP

  function fundFromEoa() {
    sendTransaction({
      to: smartAddress as `0x${string}`,
      value: parseEther(String(POL_BOOTSTRAP)),
    })
  }

  return (
    <div className="space-y-5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
        <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="space-y-2 text-center">
        <CardTitle className="text-xl">One-Time Bootstrap</CardTitle>
        <CardDescription className="leading-relaxed">
          Your Smart Account needs <strong>{POL_BOOTSTRAP} POL</strong> to cover the one-time setup fee.
          After activation, all transactions are completely gasless.
        </CardDescription>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Smart Account</p>
        <AddressBox address={smartAddress} />
      </div>

      <div className="rounded-lg border px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Current POL balance</span>
        <span className={cn(
          "text-sm font-semibold tabular-nums",
          hasEnough ? "text-green-600" : "text-destructive",
        )}>
          {polBalance !== null ? `${pol.toFixed(6)} POL` : "—"}
        </span>
      </div>

      {sentPol && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Transfer sent!</AlertTitle>
          <AlertDescription>
            POL is on its way. This page will update automatically once the balance arrives.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={fundFromEoa}
          disabled={isSending || sentPol}
        >
          {isSending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending from your wallet…</>
          ) : sentPol ? (
            <><CheckCircle2 className="mr-2 h-4 w-4" />Transfer submitted</>
          ) : (
            `Send ${POL_BOOTSTRAP} POL from my wallet`
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Or manually send POL to the address above, then refresh.
        </p>
      </div>
    </div>
  )
}

function StepApprove({ smartAddress, polBalance }: { smartAddress: string; polBalance: string | null }) {
  const { approve, isPending, isSuccess, error } = useApprove()

  return (
    <div className="space-y-5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2 text-center">
        <CardTitle className="text-xl">Activate Gasless Mode</CardTitle>
        <CardDescription className="leading-relaxed">
          Approve the USD8 Paymaster once. Every future transaction will be paid
          automatically in USD8 — you'll never need POL again.
        </CardDescription>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Smart Account</p>
        <AddressBox address={smartAddress} />
      </div>

      <div className="rounded-lg border divide-y text-sm">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground">POL available for bootstrap</span>
          <span className="font-semibold tabular-nums text-green-600">
            {polBalance !== null ? `${parseFloat(polBalance).toFixed(6)} POL` : "—"}
          </span>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground">Gas cost after activation</span>
          <Badge variant="secondary" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
            0 POL forever
          </Badge>
        </div>
      </div>

      {isPending && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Sending UserOperation…</AlertTitle>
          <AlertDescription>
            Waiting for the bundler to confirm. This usually takes 10–30 seconds.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Transaction failed</AlertTitle>
          <AlertDescription className="break-words text-xs max-h-40 overflow-y-auto">
            {formatUserOpError(error)}
          </AlertDescription>
        </Alert>
      )}

      <Button className="w-full" onClick={approve} disabled={isPending || isSuccess}>
        {isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Activating…</>
        ) : isSuccess ? (
          <><CheckCircle2 className="mr-2 h-4 w-4" />Approved — refreshing…</>
        ) : (
          "Activate Gasless Transactions"
        )}
      </Button>
    </div>
  )
}

function StepDone({ smartAddress }: { smartAddress: string }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-9 w-9 text-green-600" />
      </div>
      <div className="space-y-2">
        <CardTitle className="text-xl">You're All Set!</CardTitle>
        <CardDescription className="leading-relaxed">
          Your Smart Account is active. Send USD8 with zero POL — the paymaster
          covers all gas automatically.
        </CardDescription>
      </div>
      <div className="space-y-2 text-left">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Smart Account</p>
        <AddressBox address={smartAddress} />
      </div>
    </div>
  )
}

function DisconnectButton() {
  const { mutate: disconnect } = useDisconnect()
  return (
    <Button variant="outline" size="sm" onClick={() => disconnect()}>
      Disconnect
    </Button>
  )
}

export function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const { isConnected } = useAccount()
  const { smartAddress, isLoading, polBalance, isApproved } = useAccountBalances()

  const step = deriveStep(isConnected, isLoading, smartAddress, polBalance, isApproved)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">USD8 Gasless Transfer</h1>
          <Badge variant="secondary" className="text-xs">ERC-4337</Badge>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-2">
          <ProgressDots current={step} />

          <Card>
            <CardHeader className="pb-0" />
            <CardContent className="pt-2 pb-8 px-8">
              {step === "connect" && <StepConnect />}
              {step === "loading" && <StepLoading />}
              {step === "fund" && (
                <StepFund smartAddress={smartAddress!} polBalance={polBalance} />
              )}
              {step === "approve" && (
                <StepApprove smartAddress={smartAddress!} polBalance={polBalance} />
              )}
              {step === "done" && (
                <>
                  <StepDone smartAddress={smartAddress!} />
                  <div className="mt-6">
                    <Button className="w-full" onClick={onComplete}>
                      Open App
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {isConnected && (
            <div className="flex justify-center">
              <DisconnectButton />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
