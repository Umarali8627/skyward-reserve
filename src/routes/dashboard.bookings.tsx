import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { flights } from "@/lib/mockData";
import { Download, X } from "lucide-react";

export const Route = createFileRoute("/dashboard/bookings")({ component: Bookings });

const mockBookings = flights.slice(0, 5).map((f, i) => ({
  ref: `SK-${(7000 + i * 13).toString(36).toUpperCase()}`,
  flight: f,
  status: (["confirmed", "pending", "confirmed", "cancelled", "confirmed"] as const)[i],
  paid: (["paid","pending","paid","refunded","paid"] as const)[i],
}));

const statusVariant: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
};

function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming and past flights.</p>
      </div>
      <div className="space-y-3">
        {mockBookings.map((b) => (
          <div key={b.ref} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-32">
              <div className="text-xs text-muted-foreground">Reference</div>
              <div className="font-mono font-semibold">{b.ref}</div>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{b.flight.from.city} → {b.flight.to.city}</div>
              <div className="text-xs text-muted-foreground">
                {b.flight.airline.name} · {b.flight.flightNumber} · {new Date(b.flight.departure).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusVariant[b.status]}>{b.status}</Badge>
              <Badge variant="outline">{b.paid}</Badge>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/bookings/$ref" params={{ ref: b.ref }}><Button size="sm" variant="outline">Details</Button></Link>
              <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1" />Ticket</Button>
              {b.status !== "cancelled" && <Button size="sm" variant="ghost" className="text-destructive"><X className="h-3.5 w-3.5 mr-1" />Cancel</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
