import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { USD8_ABI, USD8_ADDRESS, USD8_DECIMALS } from "../config"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { useSmartAccountAddress } from "../hooks/useSmartAccountAddress"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FundUsd8Modal({ open, onOpenChange }: Props) {
  const [amount, setAmount] = useState("10")

  const { address: eoaAddress } = useAccount()
  const { smartAddress } = useSmartAccountAddress()
  const { usd8BalanceA: smartUsd8Balance } = useAccountBalances()

  const { data: eoaUsd8Raw, refetch: refetchEoaBalance } = useReadContract({
    address: USD8_ADDRESS,
    abi: USD8_ABI,
    functionName: "balanceOf",
    args: [eoaAddress!],
    query: { enabled: !!eoaAddress, refetchInterval: 4000 },
  })

  const { writeContract, data: txHash, isPending: isSubmitting, error: writeError, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash: txHash })

  const eoaBalance = eoaUsd8Raw !== undefined ? formatUnits(eoaUsd8Raw as bigint, USD8_DECIMALS) : null
  const amountNum = parseFloat(amount) || 0
  const balanceNum = parseFloat(eoaBalance ?? "0")
  const insufficientBalance = amountNum > 0 && amountNum > balanceNum
  const isPending = isSubmitting || isConfirming

  function getFriendlyError(err: any): string {
    if (!err) return 'Something went wrong. Please try again.'

    const message = (
      err?.shortMessage ||
      err?.message ||
      err?.cause?.shortMessage ||
      err?.cause?.message ||
      ''
    ).toLowerCase()

    if (message.includes('user rejected') || message.includes('user denied') || message.includes('cancelled')) {
      return 'You rejected the transaction in your wallet.'
    }

    if (message.includes('insufficient funds') || message.includes('gas')) {
      return 'Not enough POL in your wallet to pay for gas fees.'
    }

    if (message.includes('transfer amount exceeds balance')) {
      return 'You don\'t have enough USD8 in your wallet.'
    }

    // Fallback for other errors
    return 'Transaction failed. Please check your wallet and try again.'
  }

  useEffect(() => {
    if (isSuccess) refetchEoaBalance()
  }, [isSuccess, refetchEoaBalance])

  // Reset transient tx state whenever the modal is re-opened.
  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  function handleFund() {
    if (!smartAddress || !amount) return
    writeContract({
      address: USD8_ADDRESS,
      abi: USD8_ABI,
      functionName: "transfer",
      args: [smartAddress, parseUnits(amount, USD8_DECIMALS)],
    })
  }

  function handleMax() {
    if (eoaBalance) setAmount(eoaBalance)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund Smart Account with USD8</DialogTitle>
          <DialogDescription>
            Transfer USD8 from your connected wallet into the smart account so it can pay for gasless transfers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Smart Account Info */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To Smart Account</Label>
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="font-mono text-xs break-all">{smartAddress}</div>
              {smartUsd8Balance !== null && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Current balance:{" "}
                  {Number(smartUsd8Balance).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fund-amount">Amount (USD8)</Label>
              {eoaBalance !== null && (
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Wallet: {Number(eoaBalance).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8
                </button>
              )}
            </div>
            <Input
              id="fund-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="10"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (txHash) reset()
              }}
              className={insufficientBalance ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {insufficientBalance && (
              <p className="text-xs text-destructive">
                Insufficient balance. Your wallet has{" "}
                {Number(eoaBalance).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8.
              </p>
            )}
          </div>

          {(writeError || receiptError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Funding failed</AlertTitle>
              <AlertDescription>
                {getFriendlyError(writeError || receiptError)}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Funds sent</AlertTitle>
              <AlertDescription>
                USD8 transferred to the smart account. Balance will update shortly.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Close
          </Button>
          <Button
            onClick={handleFund}
            disabled={isPending || !smartAddress || !amount || amountNum <= 0 || insufficientBalance}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Confirm in wallet…" : isConfirming ? "Confirming…" : "Fund Smart Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
