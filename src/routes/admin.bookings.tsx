import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { flights } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

const data = flights.slice(0, 12).map((f, i) => ({
  id: `SK-${1000 + i}`,
  customer: ["Aisha Khan","Daniel Lee","Maria Garcia","Yuki Tanaka","Omar Farooq"][i % 5],
  flight: f.flightNumber,
  route: `${f.from.code} → ${f.to.code}`,
  seat: ["12A","8C","5F","21D","14B"][i % 5],
  status: (["confirmed","pending","confirmed","cancelled","confirmed"] as const)[i % 5],
  amount: f.price,
}));

function AdminBookings() {
  return (
    <CrudPage title="Manage bookings" subtitle="Confirm, cancel, and assign seats."
      rows={data} searchKeys={["id","customer","flight","route"]}
      columns={[
        { key: "id", header: "Ref" },
        { key: "customer", header: "Customer" },
        { key: "flight", header: "Flight" },
        { key: "route", header: "Route" },
        { key: "seat", header: "Seat" },
        { key: "amount", header: "Amount", render: (r) => `$${r.amount}` },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="capitalize">{r.status}</Badge> },
      ]} />
  );
}
