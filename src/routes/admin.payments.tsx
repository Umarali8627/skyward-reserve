import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

const payments = Array.from({ length: 14 }).map((_, i) => ({
  id: `PMT-${2000 + i}`,
  customer: ["Aisha","Daniel","Maria","Yuki","Omar"][i % 5],
  method: ["Visa ••4242","Stripe","JazzCash","EasyPaisa","Mastercard ••1234"][i % 5],
  amount: 250 + (i * 47) % 1300,
  status: (["paid","paid","refunded","pending","paid"] as const)[i % 5],
  date: `2026-05-${(i + 1).toString().padStart(2,"0")}`,
}));

function AdminPayments() {
  return (
    <CrudPage title="Manage payments" subtitle="All inbound transactions."
      rows={payments} searchKeys={["id","customer","method"]}
      columns={[
        { key: "id", header: "ID" },
        { key: "customer", header: "Customer" },
        { key: "method", header: "Method" },
        { key: "amount", header: "Amount", render: (r) => `$${r.amount}` },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="capitalize">{r.status}</Badge> },
        { key: "date", header: "Date" },
      ]} />
  );
}
