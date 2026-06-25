import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { formatUnits, parseEther } from 'viem'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { useAccountBalances } from '../hooks/useAccountBalances'

interface SendPolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  smartAddress: string
  onSuccess?: () => void
}

const PRESETS = [0.05, 0.1, 0.2]

export function SendPolModal({ open, onOpenChange, smartAddress, onSuccess }: SendPolModalProps) {
  const { address: eoaAddress } = useAccount()
  const { data: eoaBalanceData } = useBalance({ address: eoaAddress })
  const { polBalance: smartPolBalance } = useAccountBalances()

  const [amount, setAmount] = useState('0.1')
  const [error, setError] = useState<string | null>(null)

  const { sendTransaction, isPending: isSending, isSuccess, error: sendError } = useSendTransaction()

  const eoaBalance = eoaBalanceData
    ? Number(formatUnits(eoaBalanceData.value, eoaBalanceData.decimals))
    : 0
  const currentAmount = parseFloat(amount) || 0
  const hasEnough = currentAmount > 0 && currentAmount <= eoaBalance

  const handlePreset = (val: number) => {
    setAmount(val.toString())
    setError(null)
  }

  const handleMax = () => {
    if (eoaBalance > 0) {
      setAmount(eoaBalance.toFixed(6))
      setError(null)
    }
  }

  const handleSend = async () => {
    setError(null)

    if (!smartAddress || currentAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!hasEnough) {
      setError('Insufficient POL balance in your wallet')
      return
    }

    try {
      sendTransaction({
        to: smartAddress as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (e: any) {
      setError(e?.message || 'Failed to send transaction')
    }
  }

  // Auto close + notify parent on successful submission
  if (isSuccess && open) {
    setTimeout(() => {
      onSuccess?.()
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send POL to Smart Account</DialogTitle>
          <DialogDescription>
            One-time bootstrap (native POL). This will be sent from your connected wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* From / To info */}
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs mb-1">FROM (your wallet)</div>
              <div className="font-mono text-xs bg-muted px-3 py-2 rounded-md break-all">
                {eoaAddress ?? '—'}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                Balance: <span className="font-medium">{eoaBalance.toFixed(6)} POL</span>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs mb-1">TO (Smart Account)</div>
              <div className="font-mono text-xs bg-muted px-3 py-2 rounded-md break-all">
                {smartAddress}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                Current balance: <span className="font-medium">{smartPolBalance ?? '0'} POL</span>
              </div>
            </div>
          </div>

          {/* Amount selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (POL)</label>

            <div className="flex gap-2 mb-2 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePreset(p)}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-sm transition ${
                    amount === p.toString()
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {p} POL
                </button>
              ))}
              <button
                type="button"
                onClick={handleMax}
                className="flex-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
              >
                Max
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setError(null)
                }}
                className="w-full rounded-md border bg-background px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.1"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                POL
              </div>
            </div>

            {!hasEnough && currentAmount > 0 && (
              <p className="text-xs text-destructive mt-1">
                Amount exceeds your wallet balance.
              </p>
            )}
          </div>

          {/* Info box */}
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            This POL will be sent from your connected wallet directly to the Smart Account address.
            It is required for the first UserOperation that deploys the account.
          </div>

          {/* Error */}
          {(error || sendError) && (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">
              {error || (sendError as any)?.message || 'Transaction failed'}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !hasEnough || currentAmount <= 0}
          >
            {isSending ? 'Sending...' : `Send ${currentAmount.toFixed(4)} POL`}
          </Button>
        </DialogFooter>

        {isSuccess && (
          <p className="text-center text-sm text-green-600 font-medium pt-2">
            Transaction submitted! Balance will update shortly.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
