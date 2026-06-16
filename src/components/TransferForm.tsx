import { AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { useApprove } from "../hooks/useApprove"
import { useSmartAccountAddress } from "../hooks/useSmartAccountAddress"
import { useTransfer, type TransferResult } from "../hooks/useTransfer"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface Props {
  recipient: string
  onRecipientChange: (value: string) => void
  onSuccess: (result: TransferResult) => void
}

export function TransferForm({ recipient, onRecipientChange, onSuccess }: Props) {
  const [amount, setAmount] = useState("10")

  const { smartAddress } = useSmartAccountAddress()
  const { isApproved, usd8BalanceA, refetchAllowance } = useAccountBalances(recipient)
  const { approve, isPending: isApproving, error: approveError } = useApprove()
  const { send, isPending: isSending, error: sendError } = useTransfer()

  const needsApproval = !isApproved
  const amountNum = parseFloat(amount) || 0
  const balanceNum = parseFloat(usd8BalanceA ?? "0")
  const insufficientBalance = amountNum > 0 && amountNum > balanceNum

  async function handleApprove() {
    await approve()
    await refetchAllowance()
  }

  async function handleSend() {
    if (!recipient || !amount) return
    const result = await send(recipient as `0x${string}`, amount)
    if (result) onSuccess(result)
  }

  if (!smartAddress) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Transfer USD8</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsApproval && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Approval required</AlertTitle>
            <AlertDescription className="flex items-center gap-3 mt-2">
              <span className="text-sm">The paymaster needs a one-time USD8 approval before gasless transfers work.</span>
              <Button size="sm" onClick={handleApprove} disabled={isApproving}>
                {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isApproving ? "Approving…" : "Approve Paymaster"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {approveError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Approval failed</AlertTitle>
            <AlertDescription>{approveError.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient address</Label>
          <Input
            id="recipient"
            placeholder="0x…"
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount (USD8)</Label>
            {usd8BalanceA !== null && (
              <span className="text-xs text-muted-foreground">
                Balance: {Number(usd8BalanceA).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8
              </span>
            )}
          </div>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={insufficientBalance ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {insufficientBalance && (
            <p className="text-xs text-destructive">
              Insufficient balance. You have {Number(usd8BalanceA).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8.
            </p>
          )}
        </div>

        {sendError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Transfer failed</AlertTitle>
            <AlertDescription>{sendError.message}</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          onClick={handleSend}
          disabled={isSending || needsApproval || !recipient || !amount || insufficientBalance}
        >
          {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSending ? "Sending UserOp…" : "Send Transfer"}
        </Button>
      </CardContent>
    </Card>
  )
}
