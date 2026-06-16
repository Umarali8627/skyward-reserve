import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api"; // adjust path if needed

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

interface ApiUser {
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  Bookings: number;
}

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  bookings: number;
  joined: string;
}

function mapUser(u: ApiUser): UserRow {
  return {
    id: `U-${u.user_id}`,
    username: u.user_name,
    email: u.email,
    role: u.role,
    bookings: u.Bookings,
    joined: "—", // not provided by API
  };
}

function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    adminApi
      .allUsers()
      .then((res) => {
        const data: ApiUser[] = res.data;
        setUsers(data.map(mapUser));
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load users.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Loading users…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <CrudPage
      title="Manage users"
      subtitle="All registered SkyLine accounts."
      rows={users}
      searchKeys={["username", "email", "role"]}
      columns={[
        { key: "id", header: "ID" },
        { key: "username", header: "Username" },
        { key: "email", header: "Email" },
        {
          key: "role",
          header: "Role",
          render: (r) => (
            <Badge variant="outline" className="capitalize">
              {r.role}
            </Badge>
          ),
        },
        { key: "bookings", header: "Bookings" },
        { key: "joined", header: "Joined" },
      ]}
    />
  );
}