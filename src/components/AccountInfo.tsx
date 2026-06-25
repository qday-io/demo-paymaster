import { ArrowRight, CheckCircle2, PlusCircle, XCircle } from "lucide-react"
import type React from "react"
import { useWalletClient } from "wagmi"
import { USD8_ADDRESS, USD8_DECIMALS } from "../config"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { AddressDisplay } from "./AddressDisplay"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

function BigBalance({
  label,
  value,
  unit,
  sub,
}: {
  label: string
  value: string | null
  unit: string
  sub?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      {value !== null ? (
        <p className="text-2xl font-bold tabular-nums leading-tight">
          {Number(value).toLocaleString("en-US", { maximumFractionDigits: 4 })}
          <span className="text-sm font-normal text-muted-foreground ml-1.5">{unit}</span>
        </p>
      ) : (
        <Skeleton className="h-8 w-32" />
      )}
      {sub}
    </div>
  )
}

interface Props {
  recipientAddress?: string
}

function useAddUsd8ToWallet() {
  const { data: walletClient } = useWalletClient()
  return async () => {
    if (!walletClient) return
    await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address: USD8_ADDRESS,
        decimals: USD8_DECIMALS,
        symbol: "USD8",
      },
    })
  }
}

export function AccountInfo({ recipientAddress }: Props) {
  const addToWallet = useAddUsd8ToWallet()
  const {
    smartAddress,
    isLoading,
    polBalance,
    usd8BalanceA,
    usd8BalanceB,
    isApproved,
    isDeployed,
    oraclePrice,
    paymasterDeposit,
    recipientAddress: resolvedRecipient,
  } = useAccountBalances(recipientAddress)

  if (isLoading) return <Skeleton className="h-56 w-full" />
  if (!smartAddress) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            Account State
            <Badge variant="secondary" className="font-normal text-xs">live</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-7" onClick={addToWallet}>
            <PlusCircle className="h-3.5 w-3.5" />
            Add USD8 to wallet
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Balance comparison ─────────────────────────────── */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">

          {/* User A */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">YOU</span>
              <AddressDisplay address={smartAddress} className="text-xs text-muted-foreground" />
            </div>

            <BigBalance label="USD8" value={usd8BalanceA} unit="USD8" />

            {/* POL — the key demo point */}
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2.5 py-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700 dark:text-green-400">POL balance</p>
                {polBalance !== null ? (
                  <p className="text-sm font-bold text-green-700 dark:text-green-400 tabular-nums">
                    {Number(polBalance).toFixed(6)}
                    <span className="text-xs font-normal ml-1">POL</span>
                  </p>
                ) : (
                  <Skeleton className="h-4 w-20 mt-0.5" />
                )}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center pt-10">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* User B */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">RECIPIENT</span>
              <AddressDisplay address={resolvedRecipient} className="text-xs text-muted-foreground" />
            </div>

            <BigBalance label="USD8" value={usd8BalanceB} unit="USD8" />
          </div>
        </div>

        {/* ── Status bar ─────────────────────────────────────── */}
        <div className="grid grid-cols-4 divide-x rounded-lg border text-sm">
          <div className="flex flex-col items-center py-2.5 px-2 gap-1">
            {isApproved
              ? <CheckCircle2 className="h-4 w-4 text-green-600" />
              : <XCircle className="h-4 w-4 text-destructive" />}
            <span className="text-xs text-muted-foreground leading-tight text-center">
              {isApproved ? "Paymaster approved" : "Needs approval"}
            </span>
          </div>

          <div className="flex flex-col items-center py-2.5 px-2 gap-1">
            {isDeployed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-600" />
            )}
            <span className="text-xs text-muted-foreground leading-tight text-center">
              {isDeployed ? "Smart account deployed" : "Not deployed yet"}
            </span>
          </div>

          <div className="flex flex-col items-center py-2.5 px-2 gap-1">
            <span className="font-semibold tabular-nums text-sm">
              {oraclePrice !== null ? `$${oraclePrice.toFixed(4)}` : "—"}
            </span>
            <span className="text-xs text-muted-foreground">POL / USD</span>
          </div>

          <div className="flex flex-col items-center py-2.5 px-2 gap-1">
            <span className="font-semibold tabular-nums text-sm">
              {paymasterDeposit !== null
                ? `${Number(paymasterDeposit).toFixed(3)} POL`
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground">Paymaster deposit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
