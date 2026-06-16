import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BaseError } from "viem"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a human-readable message from a viem/permissionless error, including
 * the bundler's raw `details` (which carries the real on-chain revert reason)
 * and any AA meta-messages. Falls back to the plain message for non-viem errors.
 */
export function formatUserOpError(err: unknown): string {
  if (err instanceof BaseError) {
    const parts: string[] = [err.shortMessage]
    if (err.metaMessages?.length) parts.push(err.metaMessages.join(" "))
    // `details` holds the bundler's raw JSON-RPC error message — the useful bit.
    if (err.details && !parts.join(" ").includes(err.details)) parts.push(err.details)
    return parts.filter(Boolean).join(" — ")
  }
  if (err instanceof Error) return err.message
  return String(err)
}
