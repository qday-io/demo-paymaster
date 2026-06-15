import { formatUnits } from "viem"
import { ExternalLink } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { Table, TableBody, TableCell, TableRow } from "./ui/table"
import type { TransferResult } from "../hooks/useTransfer"
import { USD8_DECIMALS } from "../config"

function fmtUsd8(v: bigint) {
  return Number(formatUnits(v, USD8_DECIMALS)).toFixed(6)
}

export function TransactionResult({ result }: { result: TransferResult }) {
  const netGas = result.gasCharged - result.refunded

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
          Transfer Complete
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            Block {result.blockNumber.toString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Tx hash:</span>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs hover:underline flex items-center gap-1"
          >
            {result.txHash.slice(0, 10)}…{result.txHash.slice(-8)}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Separator />

        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Amount sent</TableCell>
              <TableCell className="text-right font-medium">{fmtUsd8(result.amountSent)} USD8</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Gas fee pre-charged</TableCell>
              <TableCell className="text-right">{fmtUsd8(result.gasCharged)} USD8</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Refunded (overcharge)</TableCell>
              <TableCell className="text-right">{fmtUsd8(result.refunded)} USD8</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Net gas cost</TableCell>
              <TableCell className="text-right">{fmtUsd8(netGas)} USD8</TableCell>
            </TableRow>
            <TableRow className="bg-green-50 dark:bg-green-900/20 font-medium">
              <TableCell className="text-green-700 dark:text-green-400">POL spent</TableCell>
              <TableCell className="text-right text-green-700 dark:text-green-400">0 POL</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
