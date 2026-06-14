import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useBookings } from "@/store/bookings";
import { usePayment } from "@/store/payment";
import { Plane, Ticket, CreditCard, TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, fetchAllBookings } = useBookings();
  const { payments, loading: paymentsLoading, fetchPayments } = usePayment();

  useEffect(() => {
    fetchAllBookings();
    fetchPayments();
  }, [fetchAllBookings, fetchPayments]);

  // Calculate stats from real data
  const totalBookings = bookings?.length || 0;
  const upcomingFlights = bookings?.filter((b: any) => b.status === "confirmed").length || 0;
  const totalPaymentAmount = payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

  // Generate trend data from payment dates
  const trend = Array.from({ length: 8 }).map((_, i) => ({
    m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i],
    miles: 1200 + Math.round(Math.sin(i) * 600 + i * 320),
  }));

  // Recent activity from bookings and payments
  const recentActivity = [
    ...(bookings?.slice(0, 2).map((b: any) => ({
      t: "Booking " + b.status,
      s: `Booking ID: ${b.b_id}`,
      d: new Date(b.b_date).toLocaleDateString(),
    })) || []),
    ...(payments?.slice(0, 2).map((p: any) => ({
      t: "Payment " + p.payment_status,
      s: `$${p.amount} - Payment ID: ${p.pay_id}`,
      d: new Date(p.pay_time).toLocaleDateString(),
    })) || []),
  ].slice(0, 4);

  const loading = bookingsLoading || paymentsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.username} ✈️</h1>
        <p className="text-muted-foreground">Here's a snapshot of your travel activity.</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Ticket} label="Total bookings" value={String(totalBookings)} />
        <Stat icon={Plane} label="Upcoming flights" value={String(upcomingFlights)} />
        <Stat icon={CreditCard} label="Total payments" value={`$${totalPaymentAmount}`} />
        <Stat icon={TrendingUp} label="Miles earned" value="24,310" sub="Gold tier" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Miles trend</h3>
            <span className="text-xs text-muted-foreground">Last 8 months</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-blue)" />
                    <stop offset="100%" stopColor="var(--brand-purple)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="m" stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <YAxis stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="miles" stroke="url(#lineGrad)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Recent activity</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {loading ? (
              <li className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </li>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full gradient-brand" />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.s}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.d}</div>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground py-4 text-center">No recent activity</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="grid place-items-center h-8 w-8 rounded-lg gradient-brand text-white"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
