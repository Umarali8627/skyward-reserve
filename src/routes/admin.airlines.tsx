import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { useAdmin } from "@/store/admin";

export const Route = createFileRoute("/admin/airlines")({ component: AdminAirlines });

function AdminAirlines() {
  const { airlines, loading, fetchAirlines, createAirline, updateAirline, deleteAirline } = useAdmin();

  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  const rows = (airlines || []).map((a: any) => ({
    id: a.air_id,
    code: a.model_name,
    name: a.air_name,
    country: a.country,
  }));

  return (
    <CrudPage title="Manage airlines" subtitle="Carriers operating on the network."
      rows={rows} searchKeys={["code","name"]} loading={loading}
      create={{
        title: "Create airline",
        fields: [
          { name: "air_name", label: "Airline name", required: true, placeholder: "Emirates" },
          { name: "model_name", label: "Code", required: true, placeholder: "EK" },
          { name: "country", label: "Country", required: true, placeholder: "UAE" },
        ],
        toPayload: (v) => ({ air_name: v.air_name, model_name: v.model_name, country: v.country }),
      }}
      edit={{
        title: "Edit airline",
        fields: [
          { name: "air_name", label: "Airline name", required: true },
          { name: "model_name", label: "Code", required: true },
          { name: "country", label: "Country", required: true },
        ],
        toInitialValues: (r: any) => ({ air_name: r.name ?? "", model_name: r.code ?? "", country: r.country ?? "" }),
        toPayload: (v) => ({ air_name: v.air_name, model_name: v.model_name, country: v.country }),
      }}
      onCreate={(payload) => createAirline(payload)}
      onUpdate={(id, payload) => updateAirline(Number(id), payload)}
      onDelete={(id) => deleteAirline(Number(id))}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Name" },
        { key: "country", header: "Country" },
      ]} />
  );
}
