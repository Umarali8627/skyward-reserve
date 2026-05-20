import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({ component: Register });

function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [u, setU] = useState(""); const [e, setE] = useState(""); const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    try {
      await register(u, e, p);
      toast.success("Account created");
      nav({ to: "/dashboard" });
    } catch { toast.error("Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Start exploring the world with SkyLine.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div><Label>Username</Label><Input required value={u} onChange={(e) => setU(e.target.value)} /></div>
        <div><Label>Email</Label><Input type="email" required value={e} onChange={(e) => setE(e.target.value)} /></div>
        <div><Label>Password</Label><Input type="password" required value={p} onChange={(e) => setP(e.target.value)} /></div>
        <Button type="submit" disabled={loading} className="w-full gradient-brand text-white border-0">
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground">
        Already a member? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
