import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { BarChart3, Plane, Building2, Tag, Armchair, Ticket, Users, CreditCard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("skyline-auth");
      if (!raw) throw redirect({ to: "/auth/login" });
      try {
        const j = JSON.parse(raw);
        if (j?.state?.user?.role !== "admin") throw redirect({ to: "/dashboard" });
      } catch { throw redirect({ to: "/auth/login" }); }
    }
  },
});

const items = [
  // Use absolute paths so navigation works correctly
  { to: "/admin", label: "Analytics", icon: BarChart3 },
  { to: "/admin/flights", label: "Flights", icon: Plane },
  { to: "/admin/airports", label: "Airports", icon: Building2 },
  { to: "/admin/airlines", label: "Airlines", icon: Tag },
  { to: "/admin/seats", label: "Seats", icon: Armchair },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

function AdminLayout() {
  return <AppShell items={items} title="Admin Console"><Outlet /></AppShell>;
}
