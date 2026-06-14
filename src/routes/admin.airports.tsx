import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { useAdmin } from "@/store/admin";

export const Route = createFileRoute("/admin/airports")({ component: AdminAirports });

function AdminAirports() {
  const { airports, loading, fetchAirports, createAirport, updateAirport, deleteAirport } = useAdmin();

  useEffect(() => {
    fetchAirports();
  }, [fetchAirports]);

  const rows = (airports || []).map((a: any) => ({
    id: a.airp_id,
    name: a.airport_name,
    city: a.city,
    country: a.country,
  }));

  return (
    <CrudPage title="Manage airports" subtitle="The global airport registry."
      rows={rows} searchKeys={["name","city","country"]} loading={loading}
      create={{
        title: "Create airport",
        fields: [
          { name: "airport_name", label: "Airport name", required: true, placeholder: "Dubai International" },
          { name: "city", label: "City", required: true, placeholder: "Dubai" },
          { name: "country", label: "Country", required: true, placeholder: "UAE" },
        ],
        toPayload: (v) => ({ airport_name: v.airport_name, city: v.city, country: v.country }),
      }}
      edit={{
        title: "Edit airport",
        fields: [
          { name: "airport_name", label: "Airport name", required: true },
          { name: "city", label: "City", required: true },
          { name: "country", label: "Country", required: true },
        ],
        toInitialValues: (r: any) => ({ airport_name: r.name ?? "", city: r.city ?? "", country: r.country ?? "" }),
        toPayload: (v) => ({ airport_name: v.airport_name, city: v.city, country: v.country }),
      }}
      onCreate={(payload) => createAirport(payload)}
      onUpdate={(id, payload) => updateAirport(Number(id), payload)}
      onDelete={(id) => deleteAirport(Number(id))}
      columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "city", header: "City" },
        { key: "country", header: "Country" },
      ]} />
  );
}
