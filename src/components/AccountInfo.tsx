import type React from "react"
import { EXPLORER_URL, USER_B_ADDRESS } from "../config"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`

function Row({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className={`flex justify-between items-center py-1 px-2 rounded-md ${highlight ? "bg-green-50 dark:bg-green-900/20" : ""}`}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={`text-sm ${mono ? "font-mono text-xs" : ""} ${highlight ? "text-green-700 dark:text-green-400 font-medium" : ""}`}>
        {value}
      </span>
    </div>
  )
}

export function AccountInfo() {
  const {
    smartAddress,
    isLoading,
    polBalance,
    usd8BalanceA,
    usd8BalanceB,
    isApproved,
    oraclePrice,
    paymasterDeposit,
  } = useAccountBalances()

  if (isLoading) return <Skeleton className="h-48 w-full" />
  if (!smartAddress) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Account State
          <Badge variant="secondary" className="font-normal text-xs">live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-xs text-muted-foreground mb-2 px-2">
          Smart Account:{" "}
          <a href={`${EXPLORER_URL}/address/${smartAddress}`} target="_blank" rel="noreferrer" className="font-mono hover:underline">
            {shortAddr(smartAddress)}
          </a>
          {" · "}
          User B:{" "}
          <a href={`${EXPLORER_URL}/address/${USER_B_ADDRESS}`} target="_blank" rel="noreferrer" className="font-mono hover:underline">
            {shortAddr(USER_B_ADDRESS)}
          </a>
        </p>

        <Row
          label="User A — POL balance"
          value={polBalance !== null ? `${polBalance} POL` : "—"}
          highlight
        />
        <Row
          label="User A — USD8 balance"
          value={usd8BalanceA !== null ? `${usd8BalanceA} USD8` : "—"}
        />
        <Row
          label="User B — USD8 balance"
          value={usd8BalanceB !== null ? `${usd8BalanceB} USD8` : "—"}
        />
        <Row
          label="Paymaster approved"
          value={
            <Badge variant={isApproved ? "default" : "destructive"}>
              {isApproved ? "Yes" : "No — approve required"}
            </Badge>
          }
        />
        <Row
          label="Oracle POL/USD"
          value={oraclePrice !== null ? `$${oraclePrice.toFixed(4)}` : "—"}
        />
        <Row
          label="Paymaster deposit"
          value={paymasterDeposit !== null ? `${paymasterDeposit} POL` : "—"}
        />
      </CardContent>
    </Card>
  )
}
