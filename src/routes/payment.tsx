import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { useBooking } from "@/store/booking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Wallet, Smartphone } from "lucide-react";

export const Route = createFileRoute("/payment")({ component: Payment });

function Payment() {
  const { flight, selectedSeats, reset } = useBooking();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!flight) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">No active booking</h1>
          <p className="text-muted-foreground mt-2">Pick a flight first.</p>
          <Button className="mt-6 gradient-brand text-white border-0" onClick={() => nav({ to: "/flights/search" })}>Browse flights</Button>
        </div>
      </div>
    );
  }

  const seats = selectedSeats.length || 1;
  const total = flight.price * seats;

  const pay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Payment successful — ticket issued.");
    reset();
    nav({ to: "/dashboard/bookings" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Payment</h1>
            <p className="text-muted-foreground">Choose your preferred method.</p>
          </div>
          <Tabs defaultValue="card" className="glass-strong rounded-2xl p-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-2" />Card</TabsTrigger>
              <TabsTrigger value="stripe"><Wallet className="h-4 w-4 mr-2" />Stripe</TabsTrigger>
              <TabsTrigger value="jazz"><Smartphone className="h-4 w-4 mr-2" />JazzCash</TabsTrigger>
              <TabsTrigger value="easy"><Smartphone className="h-4 w-4 mr-2" />EasyPaisa</TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="mt-6 space-y-4">
              <div><Label>Card number</Label><Input placeholder="4242 4242 4242 4242" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                <div><Label>CVC</Label><Input placeholder="123" /></div>
              </div>
              <div><Label>Cardholder name</Label><Input placeholder="As shown on card" /></div>
            </TabsContent>
            <TabsContent value="stripe" className="mt-6 text-sm text-muted-foreground">
              You'll be redirected to Stripe's secure checkout.
            </TabsContent>
            <TabsContent value="jazz" className="mt-6 space-y-4">
              <div><Label>JazzCash mobile</Label><Input placeholder="03XX-XXXXXXX" /></div>
              <div><Label>OTP</Label><Input placeholder="6-digit code" /></div>
            </TabsContent>
            <TabsContent value="easy" className="mt-6 space-y-4">
              <div><Label>EasyPaisa mobile</Label><Input placeholder="03XX-XXXXXXX" /></div>
              <div><Label>OTP</Label><Input placeholder="6-digit code" /></div>
            </TabsContent>
          </Tabs>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Passenger details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>First name</Label><Input /></div>
              <div><Label>Last name</Label><Input /></div>
              <div className="sm:col-span-2"><Label>Email</Label><Input type="email" /></div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Flight" value={`${flight.airline.code} ${flight.flightNumber}`} />
              <Row label="Route" value={`${flight.from.code} → ${flight.to.code}`} />
              <Row label="Departure" value={new Date(flight.departure).toLocaleString()} />
              <Row label="Class" value={flight.seatClass} />
              <Row label="Seats" value={selectedSeats.join(", ") || "—"} />
              <hr className="border-border/60 my-2" />
              <Row label={`Subtotal (${seats})`} value={`$${total}`} />
              <Row label="Taxes & fees" value="$0" />
              <hr className="border-border/60 my-2" />
              <Row label="Total" value={`$${total}`} bold />
            </div>
            <Button disabled={loading} onClick={pay} className="mt-6 w-full gradient-brand text-white border-0">
              {loading ? "Processing..." : `Pay $${total}`}
            </Button>
            <p className="mt-2 text-[10px] text-center text-muted-foreground">Secured with bank-grade encryption.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-bold text-base" : "capitalize"}>{value}</span>
    </div>
  );
}
