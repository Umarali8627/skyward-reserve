import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { SeatSelector } from "@/components/seats/SeatSelector";
import { useBooking } from "@/store/booking";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { flightApi } from "@/lib/api";

// Shape returned by GET /flights/id/{id}
interface FlightDetail {
  f_id: number;
  airline_id: number;
  airline_name: string;
  dep_city: string;
  arr_city: string;
  dep_airport: string;
  arr_airport: string;
  departure_time: string;
  arrival_time: string;
  total_seats: number;
  available_seats: number;
  economy_seats: number;
  premium_seats: number;
  business_seats: number;
  economy_price: number;
  premium_price: number;
  business_price: number;
  status: string;
}

export const Route = createFileRoute("/booking/$flightId")({ component: Booking });

function Booking() {
  const { flightId } = useParams({ strict: false }) as { flightId: string };
  const { selectedSeats, seatClass, setFlight } = useBooking();
  const nav = useNavigate();
  const [flight, setLocalFlight] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await flightApi.get(flightId);
        const data: FlightDetail = res.data;
        setLocalFlight(data);
        setFlight(data);
      } catch (err) {
        console.error("Failed to load flight", err);
        setError("Failed to load flight details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (flightId) load();
  }, [flightId, setFlight]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-muted-foreground">
          Loading flight details…
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-destructive">
          {error ?? "Flight not found."}
        </div>
      </div>
    );
  }

  // seatClass is "Business" | "Premium" | "Economy" | null (capitalized, matches API)
  const pricePerSeat =
    seatClass === "Business"
      ? flight.business_price
      : seatClass === "Premium"
      ? flight.premium_price
      : flight.economy_price; // default to economy if null or "Economy"

  const seatCount = Math.max(selectedSeats.length, 1);
  const total = pricePerSeat * seatCount;

  const formattedDeparture = flight.departure_time
    ? new Date(flight.departure_time).toLocaleString()
    : "—";

  const formattedArrival = flight.arrival_time
    ? new Date(flight.arrival_time).toLocaleString()
    : "—";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
        {/* Seat map */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Select your seat</h1>
            <p className="text-muted-foreground">
              {flight.dep_city} → {flight.arr_city} · {flight.airline_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {flight.dep_airport} → {flight.arr_airport}
            </p>
          </div>
          <SeatSelector flight={flight} />
        </div>

        {/* Summary sidebar */}
        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold text-lg">Booking summary</h3>

            <div className="mt-4 space-y-3 text-sm">
              <Row label="Airline" value={flight.airline_name} />
              <Row label="Route" value={`${flight.dep_city} → ${flight.arr_city}`} />
              <Row label="Departure" value={formattedDeparture} />
              <Row label="Arrival" value={formattedArrival} />
              <Row
                label="Class"
                value={seatClass ?? "Select a seat"}
              />
              <Row
                label="Seats"
                value={selectedSeats.length ? selectedSeats.join(", ") : "None selected"}
              />
              <Row label="Available seats" value={String(flight.available_seats)} />

              <hr className="border-border/60" />

              {/* Show all class prices for reference */}
              <Row label="Economy price" value={`PKR ${flight.economy_price.toLocaleString()}`} />
              <Row label="Premium price" value={`PKR ${flight.premium_price.toLocaleString()}`} />
              <Row label="Business price" value={`PKR ${flight.business_price.toLocaleString()}`} />

              <hr className="border-border/60" />

              <Row
                label="Price per seat"
                value={`PKR ${pricePerSeat.toLocaleString()}`}
              />
              <Row
                label={`Total (${seatCount} seat${seatCount > 1 ? "s" : ""})`}
                value={`PKR ${total.toLocaleString()}`}
                bold
              />
            </div>

            <Button
              disabled={selectedSeats.length === 0 || flight.available_seats === 0}
              className="mt-6 w-full gradient-brand text-white border-0"
              onClick={() => nav({ to: "/payment" })}
            >
              {flight.available_seats === 0
                ? "No seats available"
                : "Continue to payment"}
            </Button>

            <Link
              to="/flights/$id"
              params={{ id: String(flight.f_id) }}
              className="block mt-2 text-center text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to flight details
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={bold ? "font-bold text-base text-right" : "capitalize text-right"}>
        {value}
      </span>
    </div>
  );
}