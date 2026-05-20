import { createFileRoute } from "@tanstack/react-router";
import { Plane, Users, Ticket, DollarSign } from "lucide-react";
import {
  Area, AreaChart, BarChart, Bar, CartesianGrid, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/admin/")({ component: Analytics });

const revenue = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  rev: 80000 + Math.round(Math.sin(i / 1.6) * 25000 + i * 4200),
}));
const bookings = revenue.map((r) => ({ m: r.m, b: 800 + Math.round(r.rev / 240) }));
const userGrowth = revenue.map((r, i) => ({ m: r.m, u: 4200 + i * 320 + Math.round(Math.cos(i) * 180) }));
const pie = [
  { name: "Economy", v: 62 },
  { name: "Premium", v: 24 },
  { name: "Business", v: 14 },
];
const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard analytics</h1>
        <p className="text-muted-foreground">Network-wide performance at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={DollarSign} label="Revenue (YTD)" value="$2.84M" sub="+18.4% YoY" />
        <Stat icon={Ticket} label="Bookings" value="14,820" sub="+9.2% MoM" />
        <Stat icon={Plane} label="Active flights" value="312" sub="48 departing today" />
        <Stat icon={Users} label="Users" value="68,420" sub="+1,240 this week" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-semibold">Revenue</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="m" stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <YAxis stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="rev" stroke="var(--brand-purple)" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Class mix</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="v" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {pie.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Bookings per month</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={bookings}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="m" stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <YAxis stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="b" fill="var(--brand-blue)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">User growth</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="m" stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <YAxis stroke="currentColor" tick={{ fill: "currentColor", opacity: 0.6 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="u" stroke="var(--brand-blue)" fill="url(#ug)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
