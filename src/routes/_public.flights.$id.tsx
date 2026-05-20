import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { flights } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plane, Clock, Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/_public/flights/$id")({ component: FlightDetails });

function FlightDetails() {
  const { id } = useParams({ strict: false }) as { id: string };
  const f = flights.find((x) => x.id === id);
  if (!f) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-muted-foreground">Flight not found.</div>;
  }
  const dep = new Date(f.departure);
  const arr = new Date(f.arrival);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="p-6 gradient-brand text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-12 w-12 rounded-xl bg-white/15 backdrop-blur text-sm font-bold">
              {f.airline.code}
            </div>
            <div>
              <div className="font-semibold">{f.airline.name}</div>
              <div className="text-sm opacity-80">Flight {f.flightNumber}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${f.price}</div>
            <div className="text-xs opacity-80">per passenger</div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <Info icon={Plane} label="Route" value={`${f.from.code} → ${f.to.code}`} sub={`${f.from.city} → ${f.to.city}`} />
          <Info icon={Calendar} label="Departure" value={dep.toLocaleString()} />
          <Info icon={Clock} label="Duration" value={`${Math.floor(f.durationMin/60)}h ${f.durationMin%60}m`} sub={`Arrives ${arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}`} />
          <Info icon={Users} label="Seats left" value={`${f.seatsLeft}`} />
          <Info icon={Plane} label="Class" value={f.seatClass} />
          <Info icon={Plane} label="Status" value={f.status} />
        </div>
        <div className="p-6 pt-0">
          <Link to="/booking/$flightId" params={{ flightId: f.id }}>
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
