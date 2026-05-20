import { createFileRoute } from "@tanstack/react-router";
import { SeatSelector } from "@/components/seats/SeatSelector";

export const Route = createFileRoute("/admin/seats")({ component: AdminSeats });

function AdminSeats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage seats</h1>
        <p className="text-muted-foreground">Preview the seat map used during booking.</p>
      </div>
      <SeatSelector />
    </div>
  );
}
