import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      nav({ to: email.toLowerCase().includes("admin") ? "/admin" : "/dashboard" });
    } catch {
      toast.error("Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome back. Enter your details below.</p>
      <p className="mt-2 text-xs text-muted-foreground">Tip: include "admin" in email to see the admin dashboard.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div>
          <div className="flex justify-between"><Label>Password</Label>
            <Link to="/auth/forgot" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-brand text-white border-0">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground">
        Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Create one</Link>
      </p>
    </div>
  );
}
