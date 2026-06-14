import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { useAdmin } from "@/store/admin";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/flights")({ component: AdminFlights });

function AdminFlights() {
  const { flights, loading, fetchFlights, createFlight, updateFlight, deleteFlight } = useAdmin();

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const rows = (flights || []).map((f: any) => ({
    id: f.f_id,
    airline_id: f.airline_id,
    dep_air_id: f.dep_air_id,
    arr_air_id: f.arr_air_id,
    departure_time: f.departure_time,
    arrival_time: f.arrival_time,
    total_seats: f.total_seats,
    status: f.status ?? "on-time",
  }));

  const toIso = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toISOString();
  };

  const safeDate = (value: any) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value ?? "") : d.toLocaleString();
  };

  return (
    <CrudPage
      title="Manage flights"
      subtitle="Add, edit and monitor flight schedules."
      rows={rows}
      searchKeys={["airline_id", "dep_air_id", "arr_air_id", "status"]}
      loading={loading}
      create={{
        title: "Create flight",
        fields: [
          { name: "airline_id", label: "Airline ID", required: true, type: "number", placeholder: "1" },
          { name: "dep_air_id", label: "Departure Airport ID", required: true, type: "number", placeholder: "1" },
          { name: "arr_air_id", label: "Arrival Airport ID", required: true, type: "number", placeholder: "2" },
          { name: "departure_time", label: "Departure time", required: true, type: "datetime-local" },
          { name: "arrival_time", label: "Arrival time", required: true, type: "datetime-local" },
          { name: "total_seats", label: "Total seats", required: true, type: "number", placeholder: "180" },
        ],
        toPayload: (v) => ({
          airline_id: Number(v.airline_id),
          dep_air_id: Number(v.dep_air_id),
          arr_air_id: Number(v.arr_air_id),
          departure_time: toIso(v.departure_time),
          arrival_time: toIso(v.arrival_time),
          total_seats: Number(v.total_seats),
        }),
      }}
      edit={{
        title: "Edit flight",
        fields: [
          { name: "airline_id", label: "Airline ID", required: true, type: "number" },
          { name: "dep_air_id", label: "Departure Airport ID", required: true, type: "number" },
          { name: "arr_air_id", label: "Arrival Airport ID", required: true, type: "number" },
          { name: "departure_time", label: "Departure time", required: true, type: "datetime-local" },
          { name: "arrival_time", label: "Arrival time", required: true, type: "datetime-local" },
          { name: "total_seats", label: "Total seats", required: true, type: "number" },
          { name: "status", label: "Status", placeholder: "on-time" },
        ],
        toInitialValues: (r: any) => ({
          airline_id: String(r.airline_id ?? ""),
          dep_air_id: String(r.dep_air_id ?? ""),
          arr_air_id: String(r.arr_air_id ?? ""),
          departure_time: r.departure_time ? String(r.departure_time).slice(0, 16) : "",
          arrival_time: r.arrival_time ? String(r.arrival_time).slice(0, 16) : "",
          total_seats: String(r.total_seats ?? ""),
          status: String(r.status ?? ""),
        }),
        toPayload: (v) => ({
          airline_id: Number(v.airline_id),
          dep_air_id: Number(v.dep_air_id),
          arr_air_id: Number(v.arr_air_id),
          departure_time: toIso(v.departure_time),
          arrival_time: toIso(v.arrival_time),
          total_seats: Number(v.total_seats),
          status: v.status || undefined,
        }),
      }}
      onCreate={(payload) => createFlight(payload)}
      onUpdate={(id, payload) => updateFlight(Number(id), payload)}
      onDelete={(id) => deleteFlight(Number(id))}
      columns={[
        { key: "id", header: "ID" },
        { key: "airline_id", header: "Airline" },
        { key: "dep_air_id", header: "From" },
        { key: "arr_air_id", header: "To" },
        { key: "departure_time", header: "Departure", render: (r: any) => safeDate(r.departure_time) },
        { key: "arrival_time", header: "Arrival", render: (r: any) => safeDate(r.arrival_time) },
        { key: "total_seats", header: "Seats" },
        { key: "status", header: "Status", render: (r: any) => <Badge variant="outline" className="capitalize">{r.status}</Badge> },
      ]}
    />
  );
}
