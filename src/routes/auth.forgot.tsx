import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({ component: Forgot });

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <h1 className="text-3xl font-bold">Reset password</h1>
      <p className="mt-2 text-sm text-muted-foreground">We'll send you a secure link.</p>
      {sent ? (
        <div className="mt-8 glass rounded-2xl p-6 text-sm">If an account exists, a reset link has been sent.</div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Reset link sent"); }} className="mt-8 space-y-4">
          <div><Label>Email</Label><Input type="email" required /></div>
          <Button className="w-full gradient-brand text-white border-0">Send link</Button>
        </form>
      )}
      <p className="mt-6 text-sm text-center text-muted-foreground">
        <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
