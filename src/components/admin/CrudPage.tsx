import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function CrudPage<T extends { id: string | number }>({
  title, subtitle, rows, columns, searchKeys,
}: {
  title: string;
  subtitle: string;
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
}) {
  const [q, setQ] = useState("");
  const filtered = rows.filter((r) =>
    !q ? true : searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Button className="gradient-brand text-white border-0" onClick={() => toast.info("Create dialog (demo)")}>
          <Plus className="h-4 w-4 mr-1" /> Add new
        </Button>
      </div>
      <div className="glass rounded-2xl">
        <div className="p-4 border-b border-border/40 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <Badge variant="outline">{filtered.length} of {rows.length}</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={String(c.key)} className={c.className}>{c.header}</TableHead>)}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={String(r.id)}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)} className={c.className}>
                    {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => toast.info("Edit (demo)")}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => toast.error("Delete (demo)")}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">No records.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
