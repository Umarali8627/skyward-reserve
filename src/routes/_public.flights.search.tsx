import { createFileRoute } from "@tanstack/react-router";
import { FlightSearchForm } from "@/components/flights/FlightSearchForm";
import { FlightCard } from "@/components/flights/FlightCard";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { searchFlights } from "@/lib/flights";
import type { Flight } from "@/lib/types";

type Search = {
  from?: string; to?: string; depart?: string; ret?: string; pax?: string; cls?: string;
};

// Airline code → color map for known Pakistani airlines
const airlineColors: Record<string, string> = {
  PIA:        "#004F9F",
  "Air Blue": "#00AEEF",
  Airblue:    "#00AEEF",
  Serene:     "#6d5cff",
  "Fly Jinnah": "#E31837",
};

function transformApiFlightData(apiData: any): Flight | null {
  try {
    // ── Derive short codes from city/airport names ──────────────────────────
    const depCity: string  = apiData.dep_city    ?? "";
    const arrCity: string  = apiData.arr_city    ?? "";
    const depAirport: string = apiData.dep_airport ?? "";
    const arrAirport: string = apiData.arr_airport ?? "";

    // 3-letter code: first 3 letters of city name, upper-cased
    const fromCode = depCity.slice(0, 3).toUpperCase() ;
    const toCode   = arrCity.slice(0, 3).toUpperCase() ;

    const airlineName: string = apiData.airline_name ?? "SkyLine Air";
    // 2-letter airline code from first 2 letters of airline name
    const airlineCode = airlineName.slice(0, 3).toUpperCase();

    // ── Duration from real departure/arrival times ──────────────────────────
    const depTime  = apiData.departure_time ?? new Date().toISOString();
    const arrTime  = apiData.arrival_time   ?? new Date().toISOString();
    const durationMin = Math.max(
      Math.round(
        (new Date(arrTime).getTime() - new Date(depTime).getTime()) / 60000
      ),
      0
    );
    console.log("RAW FLIGHT:", apiData);

    return {
      id:           String(apiData.f_id),
      airline: {
        code:  airlineCode,
        name:  airlineName,
        color: airlineColors[airlineName] ?? "#6d5cff",
      },
      flightNumber: `${airlineCode}${apiData.f_id}`,
      from: {
        id:      0,
        code:    fromCode,
        city:    depCity,
        name:    depAirport,
        country: "",
      },
      to: {
        id:      0,
        code:    toCode,
        city:    arrCity,
        name:    arrAirport,
        country: "",
      },
      departure:   depTime,
      arrival:     arrTime,
      durationMin,
      // Show economy price on card; user picks class on booking page
      price:      apiData.economy_price    ?? 0,
      seatClass:  "economy",
      seatsLeft:  apiData.available_seats  ?? 0,
      status:     (apiData.status as Flight["status"]) ?? "pending",
      
    };
  } catch (err) {
    console.error("Failed to transform flight data:", err, apiData);
    return null;
  }
}

export const Route = createFileRoute("/_public/flights/search")({
  component: SearchPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    from:   (s.from   as string) || undefined,
    to:     (s.to     as string) || undefined,
    depart: (s.depart as string) || undefined,
    ret:    (s.ret    as string) || undefined,
    pax:    (s.pax    as string) || undefined,
    cls:    (s.cls    as string) || undefined,
  }),
});

type Filter = "all" | "economy" | "business" | "cheapest" | "fastest";

function SearchPage() {
  const params = Route.useSearch();
  const [filter, setFilter]   = useState<Filter>("all");
  const [results, setResults] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await searchFlights({
          from:   params.from,
          to:     params.to,
          depart: params.depart,
        });
        const f = (data || [])
          .map((flight) => transformApiFlightData(flight))   // ← no fallback needed
          .filter((f): f is Flight => f !== null);
        setResults(f);
      } catch (err) {
        console.error("Failed fetching flights", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.from, params.to, params.depart]);

  const filtered = useMemo(() => {
    let f = [...results];
    if (filter === "economy")  f = f.filter((x) => x.seatClass === "economy");
    if (filter === "business") f = f.filter((x) => x.seatClass === "business");
    if (filter === "cheapest") f = [...f].sort((a, b) => a.price - b.price);
    if (filter === "fastest")  f = [...f].sort((a, b) => a.durationMin - b.durationMin);
    return f;
  }, [results, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <FlightSearchForm />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {params.from ?? "Anywhere"} → {params.to ?? "Anywhere"}
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} flights found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "economy", "business", "cheapest", "fastest"] as Filter[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              className={filter === f ? "gradient-brand text-white border-0 capitalize" : "capitalize"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            Loading flights…
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No flights match your filters.
          </div>
        ) : (
          filtered.map((f) => <FlightCard key={f.id} flight={f} />)
        )}
      </div>
    </div>
  );
}