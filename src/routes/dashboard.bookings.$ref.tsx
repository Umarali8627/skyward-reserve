import { createFileRoute, useParams } from "@tanstack/react-router";
import { flights } from "@/lib/mockData";
import { QRCodeCanvas } from "qrcode.react";

export const Route = createFileRoute("/dashboard/bookings/$ref")({ component: BookingDetails });

function BookingDetails() {
  const { ref } = useParams({ strict: false }) as { ref: string };
  const f = flights[0];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="p-6 gradient-brand text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Boarding pass</div>
              <div className="mt-1 text-2xl font-bold">{f.airline.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">Ref</div>
              <div className="font-mono font-semibold">{ref}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold">{f.from.code}</div>
              <div className="text-xs opacity-80">{f.from.city}</div>
            </div>
            <div className="text-center text-xs opacity-80 self-end">✈ {f.flightNumber}</div>
            <div className="text-right">
              <div className="text-3xl font-bold">{f.to.code}</div>
              <div className="text-xs opacity-80">{f.to.city}</div>
            </div>
          </div>
        </div>
        <div className="p-6 grid sm:grid-cols-3 gap-4">
          <Field label="Passenger" value="Daniel Lee" />
          <Field label="Seat" value="12A" />
          <Field label="Class" value={f.seatClass} />
          <Field label="Gate" value="B17" />
          <Field label="Boarding" value={new Date(f.departure).toLocaleString()} />
          <Field label="Status" value={f.status} />
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
