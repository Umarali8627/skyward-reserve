import { cn } from "@/lib/utils";
import { useBooking } from "@/store/booking";
import { useMemo } from "react";

type SeatStatus = "available" | "booked" | "selected";

function generateLayout() {
  // 30 rows total: 1-4 First/Business, 5-10 Premium, 11-30 Economy
  const rows: Array<{ row: number; section: "Business" | "Premium" | "Economy"; cols: string[] }> = [];
  for (let r = 1; r <= 30; r++) {
    const section = r <= 4 ? "Business" : r <= 10 ? "Premium" : "Economy";
    const cols = section === "Business" ? ["A", "C", "D", "F"] : ["A", "B", "C", "D", "E", "F"];
    rows.push({ row: r, section, cols });
  }
  return rows;
}

const bookedSeats = new Set([
  "2A", "2C", "3D", "5B", "5F", "7A", "8C", "9D", "12A", "12B", "14E", "16C", "16D",
  "18F", "20A", "21C", "22D", "24E", "25A", "27F", "28B", "29C",
]);

export function SeatSelector() {
  const { selectedSeats, toggleSeat } = useBooking();
  const rows = useMemo(generateLayout, []);

  const status = (id: string): SeatStatus =>
    selectedSeats.includes(id) ? "selected" : bookedSeats.has(id) ? "booked" : "available";

  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <Legend />
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
                    const s = status(id);
                    const aisle = cols.length === 6 ? (i === 2 ? "mr-3" : "") : i === 1 ? "mr-3" : "";
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={s === "booked"}
                        onClick={() => toggleSeat(id)}
                        className={cn(
                          "h-8 w-8 rounded-md text-[10px] font-semibold transition-all",
                          aisle,
                          s === "available" && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/40 hover:scale-105",
                          s === "booked" && "bg-red-500/30 text-red-700 dark:text-red-200 cursor-not-allowed",
                          s === "selected" && "bg-blue-500 text-white shadow-md shadow-blue-500/40 scale-105",
                        )}
                        aria-label={`Seat ${id} ${s}`}
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
