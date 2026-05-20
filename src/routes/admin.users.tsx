import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

const users = Array.from({ length: 10 }).map((_, i) => ({
  id: `U-${100 + i}`,
  username: ["aisha","daniel","maria","yuki","omar","liam","sara","kenji","fatima","noah"][i],
  email: `user${i}@skyline.air`,
  role: i === 0 ? "admin" : "customer",
  joined: `2025-${(i+1).toString().padStart(2,"0")}-12`,
  bookings: 3 + (i % 7),
}));

function AdminUsers() {
  return (
    <CrudPage title="Manage users" subtitle="All registered SkyLine accounts."
      rows={users} searchKeys={["username","email","role"]}
      columns={[
        { key: "id", header: "ID" },
        { key: "username", header: "Username" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role", render: (r) => <Badge variant="outline" className="capitalize">{r.role}</Badge> },
        { key: "bookings", header: "Bookings" },
        { key: "joined", header: "Joined" },
      ]} />
  );
}
