import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/store/payment";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/payments")({ component: Payments });

function Payments() {
  const { payments, loading, error, fetchPayments } = usePayment();

  useEffect(() => {
    fetchPayments();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment history</h1>
          <p className="text-muted-foreground">All your transactions in one place.</p>
        </div>
        <div className="glass rounded-2xl p-6 flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment history</h1>
        <p className="text-muted-foreground">All your transactions in one place.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No payments yet. Book a flight and make a payment to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.pay_id}>
                  <TableCell className="font-mono">PMT-{p.pay_id}</TableCell>
                  <TableCell className="font-mono">BK-{p.booking_id}</TableCell>
                  <TableCell>{new Date(p.pay_time).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-semibold">${p.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        p.payment_status === "completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : p.payment_status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {p.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
