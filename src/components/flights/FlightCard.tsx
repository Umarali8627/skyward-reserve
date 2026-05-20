import type { Flight } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Plane, Clock } from "lucide-react";

const statusColor: Record<Flight["status"], string> = {
  "on-time": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  boarding: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  delayed: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDur(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return `${h}h ${m}m`;
}

export function FlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="group glass rounded-2xl p-5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-3 md:w-48">
          <div
            className="grid place-items-center h-11 w-11 rounded-xl text-white text-sm font-bold"
            style={{ backgroundColor: flight.airline.color }}
          >
            {flight.airline.code}
          </div>
          <div>
            <div className="font-semibold">{flight.airline.name}</div>
            <div className="text-xs text-muted-foreground">{flight.flightNumber}</div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 items-center gap-2">
          <div>
            <div className="text-2xl font-bold tracking-tight">{fmtTime(flight.departure)}</div>
            <div className="text-xs text-muted-foreground">{flight.from.code} · {flight.from.city}</div>
          </div>
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {fmtDur(flight.durationMin)}</div>
            <div className="relative my-2 w-full h-px bg-border">
              <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 text-primary rotate-90" />
            </div>
            <div>Non-stop</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight">{fmtTime(flight.arrival)}</div>
            <div className="text-xs text-muted-foreground">{flight.to.code} · {flight.to.city}</div>
          </div>
        </div>

        <div className="md:w-56 flex md:flex-col md:items-end items-center justify-between gap-3">
          <div className="flex flex-col md:items-end">
            <Badge variant="outline" className={statusColor[flight.status]}>{flight.status}</Badge>
            <div className="text-xs text-muted-foreground mt-1">{flight.seatsLeft} seats left · {flight.seatClass}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient-brand">${flight.price}</div>
            <Link to="/booking/$flightId" params={{ flightId: flight.id }}>
              <Button size="sm" className="mt-2 gradient-brand text-white border-0">Book now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
