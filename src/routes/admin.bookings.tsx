import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/store/admin";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

function AdminBookings() {
  const { bookings, loading, fetchAllBookings } = useAdmin();

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const data = bookings.map((b) => ({
    id: `BK-${b.b_id}`,
    date: new Date(b.b_date).toLocaleDateString(),
    seat: `Seat-${b.seat_id}`,
    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    user_id: b.user_id,
  }));

  return (
    <CrudPage
      title="Manage bookings"
      subtitle="View and manage all customer bookings."
      rows={data}
      searchKeys={["id", "user_id"]}
      loading={loading}
      columns={[
        { key: "id", header: "Ref" },
        { key: "date", header: "Date" },
        { key: "user_id", header: "User ID" },
        { key: "seat", header: "Seat" },
        {
          key: "status",
          header: "Status",
          render: (r) => (
            <Badge
              variant="outline"
              className={`capitalize ${
                r.status === "confirmed"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : r.status === "pending"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {r.status}
            </Badge>
          ),
        },
      ]}
    />
  );
}
