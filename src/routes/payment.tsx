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
import { bookingApi, paymentApi } from "@/lib/api";

export const Route = createFileRoute("/payment")({ component: Payment });

// ── Passenger form state type ─────────────────────────────────────────────
type PassengerForm = {
  firstName: string;
  lastName: string;
  email: string;
};

function Payment() {
  const { flight, selectedSeats, seatClass, reset } = useBooking();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  // Controlled passenger form
  const [passenger, setPassenger] = useState<PassengerForm>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Guard — if user lands here without a booking, send them back
  if (!flight) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">No active booking</h1>
          <p className="text-muted-foreground mt-2">Pick a flight first.</p>
          <Button
            className="mt-6 gradient-brand text-white border-0"
            onClick={() => nav({ to: "/flights/search" })}
          >
            Browse flights
          </Button>
        </div>
      </div>
    );
  }

  // ── Price calculation ─────────────────────────────────────────────────────
  const pricePerSeat =
    seatClass === "Business"
      ? flight.business_price
      : seatClass === "Premium"
      ? flight.premium_price
      : flight.economy_price;

  const seatCount = selectedSeats.length || 1;
  const total = pricePerSeat * seatCount;

  const formattedDeparture = flight.departure_time
    ? new Date(flight.departure_time).toLocaleString()
    : "—";

  // ── Validate form ─────────────────────────────────────────────────────────
  const isFormValid =
    passenger.firstName.trim() !== "" &&
    passenger.lastName.trim() !== "" &&
    passenger.email.trim() !== "" &&
    selectedSeats.length > 0;

  // ── Payment handler — calls real API ─────────────────────────────────────
  const pay = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all passenger details and select a seat.");
      return;
    }

    setLoading(true);
    try {
      // We book one seat at a time; loop if multiple seats selected
      // Backend: POST /bookings/create  body: { seat_id }
      // We need the actual seat_id from the DB. Since selectedSeats holds
      // seat_no strings (e.g. "5A"), we book the first selected seat.
      // ⚠️ If your SeatSelector stores seat_id numbers instead, use those directly.

      // Step 1 — create booking for each selected seat
      const bookingIds: number[] = [];
      for (const seatNo of selectedSeats) {
        const bookingRes = await bookingApi.create({ seat_no: seatNo, flight_id: flight.f_id });
        bookingIds.push(bookingRes.data.b_id);
      }

      // Step 2 — create one payment covering total amount
      // Backend: POST /payments/create  body: { booking_id, amount }
      await paymentApi.create({
        booking_id: bookingIds[0], // primary booking
        amount: total,
      });

      toast.success("Payment successful — your ticket has been issued!");
      reset();
      nav({ to: "/dashboard/bookings" });
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ?? "Payment failed. Please try again.";
      toast.error(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">

        {/* ── Left: payment method + passenger ── */}
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

          {/* ── Passenger details — fully controlled ── */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Passenger details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>First name</Label>
                <Input
                  value={passenger.firstName}
                  onChange={(e) =>
                    setPassenger((p) => ({ ...p, firstName: e.target.value }))
                  }
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Last name</Label>
                <Input
                  value={passenger.lastName}
                  onChange={(e) =>
                    setPassenger((p) => ({ ...p, lastName: e.target.value }))
                  }
                  placeholder="Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={passenger.email}
                  onChange={(e) =>
                    setPassenger((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold">Order summary</h3>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Airline"    value={flight.airline_name} />
              <Row label="Route"      value={`${flight.dep_city} → ${flight.arr_city}`} />
              <Row label="Departure"  value={formattedDeparture} />
              <Row label="From"       value={flight.dep_airport} />
              <Row label="To"         value={flight.arr_airport} />
              <Row label="Class"      value={seatClass ?? "Economy"} />
              <Row label="Seats"      value={selectedSeats.join(", ") || "—"} />

              <hr className="border-border/60 my-2" />

              <Row label="Price/seat"          value={`PKR ${pricePerSeat.toLocaleString()}`} />
              <Row label={`Subtotal (${seatCount})`} value={`PKR ${total.toLocaleString()}`} />
              <Row label="Taxes & fees"         value="PKR 0" />

              <hr className="border-border/60 my-2" />

              <Row label="Total" value={`PKR ${total.toLocaleString()}`} bold />
            </div>

            <Button
              disabled={loading || !isFormValid}
              onClick={pay}
              className="mt-6 w-full gradient-brand text-white border-0"
            >
              {loading ? "Processing..." : `Pay PKR ${total.toLocaleString()}`}
            </Button>

            {!isFormValid && (
              <p className="mt-2 text-[10px] text-center text-yellow-500">
                Fill in passenger details and select a seat to continue.
              </p>
            )}

            <p className="mt-2 text-[10px] text-center text-muted-foreground">
              Secured with bank-grade encryption.
            </p>
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