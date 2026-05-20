import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { airlines } from "@/lib/mockData";

export const Route = createFileRoute("/admin/airlines")({ component: AdminAirlines });

function AdminAirlines() {
  const rows = airlines.map((a) => ({ id: a.code, ...a }));
  return (
    <CrudPage title="Manage airlines" subtitle="Carriers operating on the network."
      rows={rows} searchKeys={["code","name"]}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Name" },
        { key: "color", header: "Brand", render: (r) => (
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded" style={{ background: r.color }} />
            <span className="font-mono text-xs">{r.color}</span>
          </div>
        )},
      ]} />
  );
}
