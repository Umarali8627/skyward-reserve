import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { bookingApi } from "@/lib/api";

export const Route = createFileRoute("/dashboard/bookings")({ component: Bookings });

const statusVariant: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
};

function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await bookingApi.list();
        setBookings(res.data || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setBookings([]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming and past flights.</p>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="glass rounded-2xl p-5 text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No bookings yet.</div>
        ) : bookings.map((b) => (
          <div key={b.id ?? b.ref} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-32">
              <div className="text-xs text-muted-foreground">Reference</div>
              <div className="font-mono font-semibold">{b.ref ?? b.reference}</div>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{b.flight?.from?.city ?? b.from_city} → {b.flight?.to?.city ?? b.to_city}</div>
              <div className="text-xs text-muted-foreground">
                {b.flight?.airline?.name ?? b.airline} · {b.flight?.flightNumber ?? b.flight_number} · {b.flight?.departure ? new Date(b.flight.departure).toLocaleString() : b.departure_time}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusVariant[b.status ?? b.booking_status]}>{b.status ?? b.booking_status}</Badge>
              <Badge variant="outline">{b.paid ? "paid" : b.payment_status ?? "pending"}</Badge>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/bookings/$ref" params={{ ref: b.ref ?? b.reference }}><Button size="sm" variant="outline">Details</Button></Link>
              <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1" />Ticket</Button>
              {((b.status ?? b.booking_status) !== "cancelled") && <Button size="sm" variant="ghost" className="text-destructive"><X className="h-3.5 w-3.5 mr-1" />Cancel</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
