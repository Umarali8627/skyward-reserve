import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { flights } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/flights")({ component: AdminFlights });

function AdminFlights() {
  const rows = flights.map((f) => ({
    id: f.id, flight: f.flightNumber, airline: f.airline.name,
    route: `${f.from.code} → ${f.to.code}`,
    dep: new Date(f.departure).toLocaleString(),
    price: f.price, status: f.status, seats: f.seatsLeft,
  }));
  return (
    <CrudPage
      title="Manage flights" subtitle="Add, edit and monitor flight schedules."
      rows={rows} searchKeys={["flight","airline","route"]}
      columns={[
        { key: "flight", header: "Flight" },
        { key: "airline", header: "Airline" },
        { key: "route", header: "Route" },
        { key: "dep", header: "Departure" },
        { key: "price", header: "Price", render: (r) => `$${r.price}` },
        { key: "seats", header: "Seats" },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline" className="capitalize">{r.status}</Badge> },
      ]}
    />
  );
}
