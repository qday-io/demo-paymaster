import { Wallet, UserPlus, ArrowRight, Shield } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface EntryChoiceProps {
  onCreateNew: () => void
  onUseExisting: () => void
}

export function EntryChoice({ onCreateNew, onUseExisting }: EntryChoiceProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">USD8 Gasless Transfer</h1>
          <Badge variant="secondary" className="text-xs">ERC-4337</Badge>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">USD8 Payment Solution</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your Smart Account is always derived from your wallet. Choose the path that fits you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create new */}
            <Card className="flex flex-col border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <UserPlus className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle>Create new Smart Account</CardTitle>
                    <CardDescription className="mt-1">First time here</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 text-sm text-muted-foreground flex-1">
                  <p>
                    We'll guide you through the one-time bootstrap:
                  </p>
                  <ul className="space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> Send a small amount of POL (one-time)
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> Deploy your Smart Account on first transaction
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> Approve the USD8 Paymaster
                    </li>
                  </ul>
                  <p className="pt-2 text-xs">
                    After this, <span className="font-medium text-foreground">all transfers are completely gasless</span> (paid in USD8).
                  </p>
                </div>

                <Button size="lg" className="w-full mt-6" onClick={onCreateNew}>
                  Create new account
                </Button>
              </CardContent>
            </Card>

            {/* Already have */}
            <Card className="flex flex-col border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>I already have a Smart Account</CardTitle>
                    <CardDescription className="mt-1">Connect existing wallet</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 text-sm text-muted-foreground flex-1">
                  <p>
                    Connect the EOA wallet you used before. Your Smart Account address is
                    automatically derived (deterministic).
                  </p>
                  <ul className="space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> No forced funding screen
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> Go straight to the app after connecting
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5" /> Approve paymaster from inside the app if needed
                    </li>
                  </ul>
                  <p className="pt-2 text-xs">
                    Use this if you have used this demo (or the same EOA + factory) before.
                  </p>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full mt-6"
                  onClick={onUseExisting}
                >
                  Connect wallet
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Your Smart Account is tied to your wallet via CREATE2. Connecting the same EOA always gives you the same smart account.
          </div>
        </div>
      </main>
    </div>
  )
}
