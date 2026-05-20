import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LayoutDashboard, Ticket, CreditCard, User, Plane } from "lucide-react";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("skyline-auth");
      if (!raw) throw redirect({ to: "/auth/login" });
      try { const j = JSON.parse(raw); if (!j?.state?.user) throw redirect({ to: "/auth/login" }); }
      catch { throw redirect({ to: "/auth/login" }); }
    }
  },
});

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/bookings", label: "My Bookings", icon: Ticket },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/flights/search", label: "Book a flight", icon: Plane },
];

function DashboardLayout() {
  const { user } = useAuth();
  if (!user) return null;
  return <AppShell items={items} title="My Travel"><Outlet /></AppShell>;
}
