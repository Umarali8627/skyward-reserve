import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { airports } from "@/lib/mockData";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightLeft, Plane, Search, Users } from "lucide-react";
import { useState } from "react";

export function FlightSearchForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [from, setFrom] = useState("DXB");
  const [to, setTo] = useState("LHR");
  const [depart, setDepart] = useState(() => new Date().toISOString().slice(0, 10));
  const [ret, setRet] = useState("");
  const [pax, setPax] = useState("1");
  const [cls, setCls] = useState("economy");

  const swap = () => { setFrom(to); setTo(from); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/flights/search",
      search: { from, to, depart, ret, pax, cls } as never,
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`glass-strong rounded-2xl p-4 md:p-6 shadow-2xl shadow-primary/10 ${compact ? "" : ""}`}
    >
      <div className="grid gap-3 md:grid-cols-12 items-end">
        <div className="md:col-span-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">From</Label>
          <AirportSelect value={from} onChange={setFrom} />
        </div>
        <div className="md:col-span-1 flex md:justify-center">
          <Button type="button" variant="ghost" size="icon" onClick={swap} className="rounded-full">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="md:col-span-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">To</Label>
          <AirportSelect value={to} onChange={setTo} />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Departure</Label>
          <Input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Return</Label>
          <Input type="date" value={ret} onChange={(e) => setRet(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-12 items-end">
        <div className="md:col-span-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Passengers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="number" min={1} max={9} value={pax} onChange={(e) => setPax(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="md:col-span-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Seat Class</Label>
          <Select value={cls} onValueChange={setCls}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-6">
          <Button type="submit" size="lg" className="w-full gradient-brand text-white border-0 hover:opacity-95 h-11">
            <Search className="h-4 w-4 mr-2" /> Search flights
            <Plane className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </form>
  );
}

function AirportSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {airports.map((a) => (
          <SelectItem key={a.code} value={a.code}>
            <span className="font-semibold mr-2">{a.code}</span>
            <span className="text-muted-foreground">{a.city}, {a.country}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
