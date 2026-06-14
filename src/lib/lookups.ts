import { api } from "@/lib/api";

export type Airport = { id: number; code: string; name: string; city: string; country: string };
export type Airline = { id: number; code: string; name: string };

export async function fetchAirports(): Promise<Airport[]> {
  const res = await api.get("/airport/all");
  return (res.data || []).map((airport: any) => ({
    id: airport.airp_id,
    code: airport.airport_name,
    name: airport.airport_name,
    city: airport.city,
    country: airport.country,
  }));
}

export async function fetchAirlines(): Promise<Airline[]> {
  const res = await api.get("/airline/all");
  return (res.data || []).map((airline: any) => ({
    id: airline.air_id,
    code: airline.model_name,
    name: airline.air_name,
  }));
}
