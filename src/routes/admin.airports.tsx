import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { airports } from "@/lib/mockData";

export const Route = createFileRoute("/admin/airports")({ component: AdminAirports });

function AdminAirports() {
  const rows = airports.map((a) => ({ id: a.code, ...a }));
  return (
    <CrudPage title="Manage airports" subtitle="The global airport registry."
      rows={rows} searchKeys={["code","city","name","country"]}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Name" },
        { key: "city", header: "City" },
        { key: "country", header: "Country" },
      ]} />
  );
}
