import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Plane, Clock, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { flightApi } from "@/lib/api";

export const Route = createFileRoute("/_public/flights/$id")({
  component: FlightDetails,
});

function FlightDetails() {
  const { id } = useParams({ strict: false }) as { id: string };
  const [flight, setFlight] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await flightApi.get(id);
        setFlight(res.data);
      } catch (err) {
        console.error("Failed to load flight", err);
        setFlight(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 text-center">Loading flight details...</div>;
  if (!flight) return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-muted-foreground">Flight not found.</div>;

  const f = flight;
  const duration = (f.durationMin ?? f.duration_min) || 0;
  const dep = new Date(f.departure ?? f.departure_time);
  const arr = new Date(f.arrival ?? (f.departure ? new Date(f.departure).getTime() + (duration * 60000) : Date.now()));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="p-6 gradient-brand text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-12 w-12 rounded-xl bg-white/15 backdrop-blur text-sm font-bold">
              {f.airline?.code ?? f.airline}
            </div>
            <div>
              <div className="font-semibold">{f.airline?.name ?? f.airline}</div>
              <div className="text-sm opacity-80">Flight {f.flightNumber ?? f.flight_number}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${f.price ?? f.fare}</div>
            <div className="text-xs opacity-80">per passenger</div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <Info icon={Plane} label="Route" value={`${f.from?.code ?? f.from_code} → ${f.to?.code ?? f.to_code}`} sub={`${f.from?.city ?? f.from_city} → ${f.to?.city ?? f.to_city}`} />
          <Info icon={Calendar} label="Departure" value={dep.toLocaleString()} />
          <Info icon={Clock} label="Duration" value={`${Math.floor(duration / 60)}h ${duration % 60}m`} sub={`Arrives ${arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}`} />
          <Info icon={Users} label="Seats left" value={`${f.seatsLeft ?? f.total_seats ?? "-"}`} />
          <Info icon={Plane} label="Class" value={f.seatClass ?? f.class} />
          <Info icon={Plane} label="Status" value={f.status ?? "on-time"} />
        </div>
        <div className="p-6 pt-0">
          <Link to="/booking/$flightId" params={{ flightId: f.id ?? f.flight_id }}>
            <Button size="lg" className="w-full gradient-brand text-white border-0">Continue to seat selection</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 font-semibold capitalize">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

