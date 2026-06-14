import { useEffect, useState } from "react";
import { flightApi } from "@/lib/api";
import { Plane, Clock, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { Flight } from "@/lib/types";

function transformApiFlightData(apiData: any): Flight | null {
  try {
    const from_code =
      apiData.from_code || apiData.from?.code || apiData.departure_airport?.code || `AIR-${apiData.dep_air_id}`;
    const to_code =
      apiData.to_code || apiData.to?.code || apiData.arrival_airport?.code || `AIR-${apiData.arr_air_id}`;
    
    if (!from_code || !to_code) return null;

    return {
      id: String(apiData.f_id || apiData.id || apiData.flight_id),
      airline: {
        code: apiData.airline_code || "Sk",
        name: apiData.airline_name || "SkyLine Air",
        color: apiData.airline_color || "#6d5cff",
      },
      flightNumber: apiData.flight_number || `SK${apiData.f_id || '000'}`,
      from: {
        id: apiData.dep_air_id || apiData.from?.id || apiData.departure_airport?.airp_id || 0,
        code: apiData.dep_city,
        city: apiData.dep_city || apiData.from?.city || apiData.departure_airport?.city || "",
        name:
          apiData.dep_airport ||
          apiData.from?.name ||
          apiData.departure_airport?.airport_name ||
          `Airport ${apiData.dep_air_id}`,
        country: apiData.from_country || apiData.from?.country || apiData.departure_airport?.country || "",
      },
      to: {
        id: apiData.arr_air_id || apiData.to?.id || apiData.arrival_airport?.airp_id || 0,
        code: apiData.arr_city,
        city: apiData.to_city || apiData.to?.city || apiData.arrival_airport?.city || "",
        name:
          apiData.arr_airport||
          apiData.to?.name ||
          apiData.arrival_airport?.airport_name ||
          `Airport ${apiData.arr_air_id}`,
        country: apiData.to_country || apiData.to?.country || apiData.arrival_airport?.country || "",
      },
      departure: apiData.departure_time || apiData.departure || new Date().toISOString(),
      arrival: apiData.arrival_time || apiData.arrival || new Date().toISOString(),
      durationMin: parseInt(apiData.duration_min || apiData.durationMin || "180"),
      price: parseFloat(apiData.economy_price || apiData.fare || "200$"),
      seatClass: (apiData.seat_class || apiData.class || apiData.seatClass || "economy").toLowerCase(),
      seatsLeft: parseInt(apiData.seats_available || apiData.seatsLeft || apiData.total_seats || "50"),
      status: (apiData.status || "on-time") as any,
    };
  } catch (err) {
    console.error("Failed to transform flight data:", err, apiData);
    return null;
  }
}

export function AvailableFlightsList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFlights() {
      setLoading(true);
      try {
        const res = await flightApi.list();
        const transformed = (res.data || [])
          .map(transformApiFlightData)
          .filter((flight: Flight | null): flight is Flight => flight !== null);
        setFlights(transformed);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load flights", err);
        setError(err?.message || "Failed to load flights");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }

    loadFlights();
  }, []);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Plane className="h-5 w-5 animate-spin" />
          Loading available flights...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-8 border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <div className="font-semibold text-red-900 dark:text-red-400">Error loading flights</div>
            <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
        No flights available at this time. Try searching for specific routes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <Link
          key={flight.id}
          to="/booking/$flightId"
          params={{ flightId: flight.id }}
          className="block"
        >
          <div className="glass rounded-2xl p-5 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Airline info */}
              <div className="flex items-center gap-3 md:w-48">
                <div
                  className="grid place-items-center h-11 w-11 rounded-xl text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: flight.airline.color }}
                >
                  {flight.airline.code}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{flight.airline.name}</div>
                  <div className="text-xs text-muted-foreground">{flight.flightNumber}</div>
                </div>
              </div>

              {/* Route - Main info */}
              <div className="flex-1 grid grid-cols-3 items-center gap-2 md:gap-4">
                {/* From */}
                <div>
                  <div className="text-lg md:text-xl font-bold">{flight.from.code}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {flight.from.name || flight.from.city}
                  </div>
                </div>

                {/* Arrow & Duration */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full h-px bg-border">
                    <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 text-primary rotate-90" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                    {formatDuration(flight.durationMin)}
                  </div>
                </div>

                {/* To */}
                <div className="text-right">
                  <div className="text-lg md:text-xl font-bold">{flight.to.code}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {flight.to.name || flight.to.city}
                  </div>
                </div>
              </div>

              {/* Details & Price */}
              <div className="flex flex-col md:items-end md:w-56">
                <div className="flex gap-2 flex-wrap md:justify-end mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {flight.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {flight.seatClass}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 md:justify-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {flight.seatsLeft} seats
                    </div>
                    <div className="text-2xl md:text-2xl  font-semibold text-gradient-brand">
                     Seats Left {flight.seatsLeft} 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info row - Times */}
            <div className="mt-4 pt-4 border-t border-border/40 flex flex-col md:flex-row md:items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Depart: {formatTime(flight.departure)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Arrive: {formatTime(flight.arrival)}</span>
              </div>
              <div className="md:ml-auto">
                <Button size="sm" className="gradient-brand text-white border-0">
                  Book now
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
