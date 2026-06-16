import { Check, Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import { EXPLORER_URL } from "../config"
import { cn } from "../lib/utils"

interface Props {
  address: string
  className?: string
  /** Show full address instead of truncated */
  full?: boolean
  /** Hide the explorer link */
  noLink?: boolean
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function AddressDisplay({ address, className, full = false, noLink = false }: Props) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="font-mono text-sm">{full ? address : shorten(address)}</span>
      <button
        type="button"
        onClick={copy}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Copy address"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-600" />
          : <Copy className="h-3.5 w-3.5" />}
      </button>
      {!noLink && (
        <a
          href={`${EXPLORER_URL}/address/${address}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="View on explorer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </span>
  )
}

/** Boxed variant — used in onboarding steps */
export function AddressBox({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
      <code className="flex-1 text-xs font-mono text-muted-foreground truncate">
        {address.slice(0, 8)}…{address.slice(-6)}
      </code>
      <button
        type="button"
        onClick={copy}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        title="Copy address"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-green-600" />
          : <Copy className="h-3.5 w-3.5" />}
      </button>
      <a
        href={`${EXPLORER_URL}/address/${address}`}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        title="View on explorer"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
