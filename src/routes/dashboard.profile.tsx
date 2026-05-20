import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/store/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({ component: Profile });

function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Update your personal information.</p>
      </div>
      <form className="glass rounded-2xl p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full gradient-brand grid place-items-center text-white text-xl font-bold uppercase">
            {user?.username?.[0] ?? "U"}
          </div>
          <div>
            <div className="font-semibold">{user?.username}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Username</Label><Input defaultValue={user?.username} /></div>
          <div><Label>Email</Label><Input type="email" defaultValue={user?.email} /></div>
          <div><Label>Phone</Label><Input placeholder="+1 415 555 0140" /></div>
          <div><Label>Country</Label><Input placeholder="United Arab Emirates" /></div>
        </div>
        <Button className="gradient-brand text-white border-0">Save changes</Button>
      </form>
    </div>
  );
}
