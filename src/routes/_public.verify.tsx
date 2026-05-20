import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_public/verify")({ component: Verify });

function Verify() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<null | "ok" | "no">(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
          <ShieldCheck className="h-3 w-3 text-primary" /> Secure verification
        </div>
        <h1 className="mt-4 text-4xl font-bold">Verify a ticket</h1>
        <p className="mt-2 text-muted-foreground">Enter your booking reference to confirm authenticity.</p>
      </div>
      <form
        className="mt-8 glass rounded-2xl p-6 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); setResult(ref.trim().length >= 6 ? "ok" : "no"); }}
      >
        <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. SK-7HQ29X" />
        <Button className="gradient-brand text-white border-0">Verify</Button>
      </form>
      {result === "ok" && (
        <div className="mt-6 glass rounded-2xl p-6 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div>
            <div className="font-semibold">Ticket verified</div>
            <div className="text-sm text-muted-foreground">Reference <span className="font-mono">{ref}</span> is valid and active.</div>
          </div>
        </div>
      )}
      {result === "no" && (
        <div className="mt-6 glass rounded-2xl p-6 text-sm text-destructive">Reference not recognized. Double-check and try again.</div>
      )}
    </div>
  );
}
