import { createFileRoute } from "@tanstack/react-router";
import { FlightSearchForm } from "@/components/flights/FlightSearchForm";
import { FlightCard } from "@/components/flights/FlightCard";
import { flights } from "@/lib/mockData";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Search = {
  from?: string; to?: string; depart?: string; ret?: string; pax?: string; cls?: string;
};

export const Route = createFileRoute("/_public/flights/search")({
  component: SearchPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: (s.from as string) || undefined,
    to: (s.to as string) || undefined,
    depart: (s.depart as string) || undefined,
    ret: (s.ret as string) || undefined,
    pax: (s.pax as string) || undefined,
    cls: (s.cls as string) || undefined,
  }),
});

type Filter = "all" | "economy" | "business" | "cheapest" | "fastest";

function SearchPage() {
  const params = Route.useSearch();
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    let f = [...flights];
    if (params.from) f = f.filter((x) => x.from.code === params.from);
    if (params.to) f = f.filter((x) => x.to.code === params.to);
    if (filter === "economy") f = f.filter((x) => x.seatClass === "economy");
    if (filter === "business") f = f.filter((x) => x.seatClass === "business");
    if (filter === "cheapest") f = f.sort((a, b) => a.price - b.price);
    if (filter === "fastest") f = f.sort((a, b) => a.durationMin - b.durationMin);
    return f;
  }, [params.from, params.to, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <FlightSearchForm />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {params.from ?? "Anywhere"} → {params.to ?? "Anywhere"}
          </h1>
          <p className="text-sm text-muted-foreground">{results.length} flights found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all","economy","business","cheapest","fastest"] as Filter[]).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"}
              className={filter === f ? "gradient-brand text-white border-0 capitalize" : "capitalize"}
              onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {results.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No flights match your filters.
          </div>
        ) : results.map((f) => <FlightCard key={f.id} flight={f} />)}
      </div>
    </div>
  );
}
