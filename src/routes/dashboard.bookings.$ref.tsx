import { createFileRoute, useParams } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { bookingApi } from "@/lib/api";

export const Route = createFileRoute("/dashboard/bookings/$ref")({ component: BookingDetails });

function BookingDetails() {
  const { ref } = useParams({ strict: false }) as { ref: string };
  const [booking, setBooking] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // fetch all bookings and find by ref — backend may not expose ref endpoint
        const res = await bookingApi.list();
        const found = (res.data || []).find((b: any) => b.ref === ref || b.reference === ref || String(b.b_id) === ref);
        setBooking(found || null);
      } catch (err) {
        console.error("Failed to load booking", err);
        setBooking(null);
      }
    }
    if (ref) load();
  }, [ref]);

  if (!booking) return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-muted-foreground">Booking not found.</div>;

  const f = booking.flight || booking;
  const depart = new Date(f.departure ?? f.departure_time);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="p-6 gradient-brand text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Boarding pass</div>
              <div className="mt-1 text-2xl font-bold">{f.airline?.name ?? f.airline}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">Ref</div>
              <div className="font-mono font-semibold">{ref}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold">{f.from?.code ?? f.from_code}</div>
              <div className="text-xs opacity-80">{f.from?.city ?? f.from_city}</div>
            </div>
            <div className="text-center text-xs opacity-80 self-end">✈ {f.flightNumber ?? f.flight_number}</div>
            <div className="text-right">
              <div className="text-3xl font-bold">{f.to?.code ?? f.to_code}</div>
              <div className="text-xs opacity-80">{f.to?.city ?? f.to_city}</div>
            </div>
          </div>
        </div>
        <div className="p-6 grid sm:grid-cols-3 gap-4">
          <Field label="Passenger" value={booking.passenger?.name ?? booking.passenger_name ?? "Passenger"} />
          <Field label="Seat" value={booking.seat ?? booking.seat_number ?? "-"} />
          <Field label="Class" value={f.seatClass ?? f.class} />
          <Field label="Gate" value={booking.gate ?? "B17"} />
          <Field label="Boarding" value={depart.toLocaleString()} />
          <Field label="Status" value={booking.status ?? booking.booking_status ?? f.status} />
        </div>
        <div className="p-6 border-t border-border/60 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Scan at gate</div>
            <div className="font-mono text-sm mt-1">{ref}</div>
          </div>
          <div className="bg-white p-2 rounded-lg">
            <QRCodeCanvas value={`SKYLINE:${ref}`} size={96} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold capitalize mt-1">{value}</div>
    </div>
  );
}
