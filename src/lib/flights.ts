import { flightApi } from "@/lib/api";
import type { Flight } from "@/lib/types";

export async function searchFlights(params: { from?: string; to?: string; depart?: string }) {
  const res = await flightApi.search({
    dep_airp: params.from ?? "",
    arr_airp: params.to ?? "",
    dept_time: params.depart ? `${params.depart}T00:00:00` : "",
  });
  return res.data as Flight[];
}

export async function getFlight(id: string | number) {
  const res = await flightApi.get(String(id));
  return res.data as Flight;
}
