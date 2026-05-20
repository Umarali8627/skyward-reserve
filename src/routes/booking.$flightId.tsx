import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { flights } from "@/lib/mockData";
import { SeatSelector } from "@/components/seats/SeatSelector";
import { useBooking } from "@/store/booking";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export const Route = createFileRoute("/booking/$flightId")({ component: Booking });

function Booking() {
  const { flightId } = useParams({ strict: false }) as { flightId: string };
  const f = flights.find((x) => x.id === flightId) ?? flights[0];
  const { selectedSeats, setFlight } = useBooking();
  const nav = useNavigate();

  useEffect(() => { setFlight(f); }, [f, setFlight]);

  const total = f.price * Math.max(selectedSeats.length, 1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Select your seat</h1>
            <p className="text-muted-foreground">{f.from.city} → {f.to.city} · {f.airline.name} {f.flightNumber}</p>
          </div>
          <SeatSelector />
        </div>
        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold">Booking summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Flight" value={`${f.airline.code} ${f.flightNumber}`} />
              <Row label="Route" value={`${f.from.code} → ${f.to.code}`} />
              <Row label="Departure" value={new Date(f.departure).toLocaleString()} />
              <Row label="Class" value={f.seatClass} />
              <Row label="Seats" value={selectedSeats.length ? selectedSeats.join(", ") : "None selected"} />
              <hr className="border-border/60" />
              <Row label="Price per seat" value={`$${f.price}`} />
              <Row label={`Total (${Math.max(selectedSeats.length, 1)})`} value={`$${total}`} bold />
            </div>
            <Button
              disabled={selectedSeats.length === 0}
              className="mt-6 w-full gradient-brand text-white border-0"
              onClick={() => nav({ to: "/payment" })}
            >Continue to payment</Button>
            <Link to="/flights/$id" params={{ id: f.id }} className="block mt-2 text-center text-xs text-muted-foreground hover:text-foreground">
              Back to flight details
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-bold text-base" : "capitalize"}>{value}</span>
    </div>
  );
}
