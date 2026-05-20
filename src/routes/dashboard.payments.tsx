import { createFileRoute } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/payments")({ component: Payments });

const rows = [
  { id: "PMT-001", date: "2026-05-10", method: "Visa ••4242", amount: 650, status: "paid" },
  { id: "PMT-002", date: "2026-04-22", method: "Stripe", amount: 1290, status: "paid" },
  { id: "PMT-003", date: "2026-03-30", method: "JazzCash", amount: 220, status: "refunded" },
  { id: "PMT-004", date: "2026-02-15", method: "EasyPaisa", amount: 540, status: "paid" },
];

function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment history</h1>
        <p className="text-muted-foreground">All your transactions in one place.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono">{r.id}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.method}</TableCell>
                <TableCell className="text-right font-semibold">${r.amount}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
