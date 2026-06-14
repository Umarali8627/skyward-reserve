import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/store/admin";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

function AdminPayments() {
  const { payments, loading, fetchAllPayments } = useAdmin();

  useEffect(() => {
    fetchAllPayments();
  }, [fetchAllPayments]);

  const data = payments.map((p) => ({
    id: `PMT-${p.pay_id}`,
    booking: `BK-${p.booking_id}`,
    amount: p.amount,
    status: p.payment_status.charAt(0).toUpperCase() + p.payment_status.slice(1),
    date: new Date(p.pay_time).toLocaleDateString(),
  }));

  return (
    <CrudPage
      title="Manage payments"
      subtitle="All inbound transactions."
      rows={data}
      searchKeys={["id", "booking"]}
      loading={loading}
      columns={[
        { key: "id", header: "ID" },
        { key: "booking", header: "Booking" },
        { key: "amount", header: "Amount", render: (r) => `$${r.amount}` },
        {
          key: "status",
          header: "Status",
          render: (r) => (
            <Badge
              variant="outline"
              className={`capitalize ${
                r.status === "Completed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : r.status === "Pending"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {r.status}
            </Badge>
          ),
        },
        { key: "date", header: "Date" },
      ]}
    />
  );
}
