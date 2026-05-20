import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({ component: Contact });

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Contact</div>
        <h1 className="mt-2 text-4xl font-bold">Talk to us</h1>
        <p className="mt-3 text-muted-foreground">Our team is available 24/7 to help with bookings, changes, and travel guidance.</p>
        <div className="mt-8 space-y-4">
          <Row icon={Mail} label="support@skyline.air" />
          <Row icon={Phone} label="+1 (415) 555-0140" />
          <Row icon={MapPin} label="DIFC Tower, Dubai · One Embarcadero, SF" />
        </div>
      </div>
      <form
        className="glass rounded-2xl p-6 space-y-4"
        onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll be in touch."); }}
      >
        <div><Label>Name</Label><Input required placeholder="Your name" /></div>
        <div><Label>Email</Label><Input required type="email" placeholder="you@example.com" /></div>
        <div><Label>Message</Label><Textarea required rows={5} placeholder="How can we help?" /></div>
        <Button className="w-full gradient-brand text-white border-0">Send message</Button>
      </form>
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid place-items-center h-10 w-10 rounded-xl glass"><Icon className="h-4 w-4 text-primary" /></div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
