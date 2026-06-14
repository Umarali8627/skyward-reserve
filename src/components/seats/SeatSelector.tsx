import { cn } from "@/lib/utils";
import { useBooking, type SeatClass } from "@/store/booking";
import { useMemo } from "react";

type SeatStatus = "available" | "booked" | "selected";

// Match exactly what your backend generates in create_flight
function generateLayout() {
  const rows: Array<{ row: number; section: SeatClass; cols: string[] }> = [];
  for (let r = 1; r <= 30; r++) {
    const section: SeatClass = r <= 4 ? "Business" : r <= 10 ? "Premium" : "Economy";
    const cols = section === "Business" ? ["A", "C", "D", "F"] : ["A", "B", "C", "D", "E", "F"];
    rows.push({ row: r, section, cols });
  }
  return rows;
}

interface FlightDetail {
  economy_seats: number;
  premium_seats: number;
  business_seats: number;
  available_seats: number;
}

interface Props {
  flight: FlightDetail;      // ← receive flight from Booking.tsx
}

export function SeatSelector({ flight }: Props) {
  const { selectedSeats, toggleSeat } = useBooking();
  const rows = useMemo(generateLayout, []);

  // Build booked seat set from real seat data via flight counts
  // Since your API doesn't return individual seat statuses yet,
  // we derive which seats are "filled" based on available_seats count
  const bookedCount = flight.business_seats + flight.premium_seats + flight.economy_seats - flight.available_seats;

  const status = (id: string, section: SeatClass): SeatStatus => {
    if (selectedSeats.includes(id)) return "selected";
    // Until you have a /seats/{flightId} endpoint, keep booked as not selectable
    // Replace this with real per-seat API data when available
    return "available";
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <Legend />
      {/* Seat count summary */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
        <span>Business: {flight.business_seats}</span>
        <span>Premium: {flight.premium_seats}</span>
        <span>Economy: {flight.economy_seats}</span>
        <span className="text-emerald-500 font-medium">Available: {flight.available_seats}</span>
      </div>

      <div className="mt-6 mx-auto max-w-md">
        <div className="relative rounded-t-[50%] border border-border/60 bg-secondary/30 pt-6 pb-3 text-center text-xs text-muted-foreground">
          Cockpit
        </div>
        <div className="space-y-1.5 py-4">
          {rows.map(({ row, section, cols }) => {
            const sectionHeader =
              row === 1 || row === 5 || row === 11 ? (
                <div className="my-3 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {section}
                </div>
              ) : null;

            return (
              <div key={row}>
                {sectionHeader}
                <div className="flex items-center justify-center gap-1">
                  <div className="w-6 text-center text-xs text-muted-foreground">{row}</div>
                  {cols.map((c, i) => {
                    const id = `${row}${c}`;
                    const s = status(id, section);
                    const aisle =
                      cols.length === 6
                        ? i === 2 ? "mr-3" : ""
                        : i === 1 ? "mr-3" : "";

                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={s === "booked"}
                        onClick={() => toggleSeat(id, section)}  // ← pass section as SeatClass
                        className={cn(
                          "h-8 w-8 rounded-md text-[10px] font-semibold transition-all",
                          aisle,
                          s === "available" && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/40 hover:scale-105",
                          s === "booked"    && "bg-red-500/30 text-red-700 dark:text-red-200 cursor-not-allowed",
                          s === "selected"  && "bg-blue-500 text-white shadow-md shadow-blue-500/40 scale-105",
                        )}
                        aria-label={`Seat ${id} (${section}) ${s}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
      <Item color="bg-emerald-500/40" label="Available" />
      <Item color="bg-red-500/40" label="Booked" />
      <Item color="bg-blue-500" label="Selected" />
    </div>
  );
}

function Item({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded", color)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}