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
    economy_seats: f.economy_seats,
    premium_seats: f.premium_seats,
    business_seats: f.business_seats,
    economy_price: f.economy_price,
    premium_price: f.premium_price,
    business_price: f.business_price,
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

  const formatPrice = (value: any) =>
    value != null ? `PKR ${Number(value).toLocaleString()}` : "—";

  const sharedFields = [
    { name: "airline_id",      label: "Airline ID",            required: true,  type: "number",         placeholder: "1" },
    { name: "dep_air_id",      label: "Departure Airport ID",  required: true,  type: "number",         placeholder: "1" },
    { name: "arr_air_id",      label: "Arrival Airport ID",    required: true,  type: "number",         placeholder: "2" },
    { name: "departure_time",  label: "Departure Time",        required: true,  type: "datetime-local"              },
    { name: "arrival_time",    label: "Arrival Time",          required: true,  type: "datetime-local"              },
    { name: "total_seats",     label: "Total Seats",           required: true,  type: "number",         placeholder: "180" },
    { name: "economy_seats",   label: "Economy Seats",         required: true,  type: "number",         placeholder: "120" },
    { name: "premium_seats",   label: "Premium Seats",         required: true,  type: "number",         placeholder: "40"  },
    { name: "business_seats",  label: "Business Seats",        required: true,  type: "number",         placeholder: "20"  },
    { name: "economy_price",   label: "Economy Price (PKR)",   required: true,  type: "number",         placeholder: "500000"  },
    { name: "premium_price",   label: "Premium Price (PKR)",   required: true,  type: "number",         placeholder: "700000"  },
    { name: "business_price",  label: "Business Price (PKR)",  required: true,  type: "number",         placeholder: "1000000" },
  ];

  const toPayload = (v: any) => ({
    airline_id:      Number(v.airline_id),
    dep_air_id:      Number(v.dep_air_id),
    arr_air_id:      Number(v.arr_air_id),
    departure_time:  toIso(v.departure_time),
    arrival_time:    toIso(v.arrival_time),
    total_seats:     Number(v.total_seats),
    economy_seats:   Number(v.economy_seats),
    premium_seats:   Number(v.premium_seats),
    business_seats:  Number(v.business_seats),
    economy_price:   Number(v.economy_price),
    premium_price:   Number(v.premium_price),
    business_price:  Number(v.business_price),
  });

  return (
    <CrudPage
      title="Manage Flights"
      subtitle="Add, edit and monitor flight schedules."
      rows={rows}
      searchKeys={["airline_id", "dep_air_id", "arr_air_id", "status"]}
      loading={loading}
      create={{
        title: "Create Flight",
        fields: sharedFields,
        toPayload,
      }}
      edit={{
        title: "Edit Flight",
        fields: [
          ...sharedFields,
          { name: "status", label: "Status", placeholder: "on-time" },
        ],
        toInitialValues: (r: any) => ({
          airline_id:      String(r.airline_id     ?? ""),
          dep_air_id:      String(r.dep_air_id     ?? ""),
          arr_air_id:      String(r.arr_air_id     ?? ""),
          departure_time:  r.departure_time ? String(r.departure_time).slice(0, 16) : "",
          arrival_time:    r.arrival_time   ? String(r.arrival_time).slice(0, 16)   : "",
          total_seats:     String(r.total_seats    ?? ""),
          economy_seats:   String(r.economy_seats  ?? ""),
          premium_seats:   String(r.premium_seats  ?? ""),
          business_seats:  String(r.business_seats ?? ""),
          economy_price:   String(r.economy_price  ?? ""),
          premium_price:   String(r.premium_price  ?? ""),
          business_price:  String(r.business_price ?? ""),
          status:          String(r.status         ?? ""),
        }),
        toPayload: (v) => ({ ...toPayload(v), status: v.status || undefined }),
      }}
      onCreate={(payload) => createFlight(payload)}
      onUpdate={(id, payload) => updateFlight(Number(id), payload)}
      onDelete={(id) => deleteFlight(Number(id))}
      columns={[
        { key: "id",             header: "ID" },
        { key: "airline_id",     header: "Airline" },
        { key: "dep_air_id",     header: "From" },
        { key: "arr_air_id",     header: "To" },
        { key: "departure_time", header: "Departure",       render: (r: any) => safeDate(r.departure_time) },
        { key: "arrival_time",   header: "Arrival",         render: (r: any) => safeDate(r.arrival_time) },
        { key: "total_seats",    header: "Total Seats" },
        { key: "economy_seats",  header: "Economy Seats" },
        { key: "premium_seats",  header: "Premium Seats" },
        { key: "business_seats", header: "Business Seats" },
        { key: "economy_price",  header: "Economy Price",   render: (r: any) => formatPrice(r.economy_price) },
        { key: "premium_price",  header: "Premium Price",   render: (r: any) => formatPrice(r.premium_price) },
        { key: "business_price", header: "Business Price",  render: (r: any) => formatPrice(r.business_price) },
        { key: "status",         header: "Status",          render: (r: any) => (
            <Badge variant="outline" className="capitalize">{r.status}</Badge>
          )
        },
      ]}
    />
  );
}