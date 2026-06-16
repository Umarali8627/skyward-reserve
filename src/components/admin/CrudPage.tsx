import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export type CrudField = {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
};

type CrudActionConfig<T extends { id: string | number }> = {
  title: string;
  fields: CrudField[];
  toInitialValues?: (row: Partial<T>) => Record<string, string>;
  toPayload?: (values: Record<string, string>, row?: T) => unknown;
};

export function CrudPage<T extends { id: string | number }>({
  title,
  subtitle,
  rows,
  columns,
  searchKeys,
  loading,
  create,
  edit,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string;
  subtitle: string;
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  loading?: boolean;
  create?: CrudActionConfig<T>;
  edit?: CrudActionConfig<T>;
  onCreate?: (payload: unknown) => Promise<unknown>;
  onUpdate?: (id: T["id"], payload: unknown) => Promise<unknown>;
  onDelete?: (id: T["id"]) => Promise<void>;
}) {
  const [q, setQ] = useState("");
  const filtered = rows.filter((r) =>
    !q ? true : searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q.toLowerCase())),
  );

  const canCreate = Boolean(create && onCreate);
  const canEdit = Boolean(edit && onUpdate);
  const canDelete = Boolean(onDelete);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<T | null>(null);

  const [createValues, setCreateValues] = useState<Record<string, string>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const ensureDefaults = (fields: CrudField[]) =>
    Object.fromEntries(fields.map((f) => [f.name, ""])) as Record<string, string>;

  const openCreate = () => {
    if (!create) return;
    setCreateValues({ ...ensureDefaults(create.fields) });
    setCreateOpen(true);
  };

  const openEdit = (row: T) => {
    if (!edit) return;
    setActiveRow(row);
    const base = { ...ensureDefaults(edit.fields) };
    const derived = edit.toInitialValues
      ? edit.toInitialValues(row)
      : (Object.fromEntries(
          edit.fields.map((f) => [f.name, String((row as any)[f.name] ?? "")])
        ) as Record<string, string>);
    setEditValues({ ...base, ...derived });
    setEditOpen(true);
  };

  const submitCreate = async () => {
    if (!create || !onCreate) return;
    try {
      const payload = create.toPayload ? create.toPayload(createValues) : createValues;
      await onCreate(payload);
      toast.success("Created");
      setCreateOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? e?.message ?? "Create failed");
    }
  };

  const submitEdit = async () => {
    if (!edit || !onUpdate || !activeRow) return;
    try {
      const payload = edit.toPayload ? edit.toPayload(editValues, activeRow) : editValues;
      await onUpdate(activeRow.id, payload);
      toast.success("Updated");
      setEditOpen(false);
      setActiveRow(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? e?.message ?? "Update failed");
    }
  };

  const submitDelete = async (id: T["id"]) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? e?.message ?? "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {canCreate && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-brand text-white border-0" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" /> Add new
              </Button>
            </DialogTrigger>

            {/* ── Create Dialog — scrollable ── */}
            <DialogContent className="max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{create!.title}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 grid gap-4 py-2 pr-1">
                {create!.fields.map((f) => (
                  <div key={f.name} className="grid gap-2">
                    <Label htmlFor={`create-${f.name}`}>{f.label}</Label>
                    <Input
                      id={`create-${f.name}`}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      required={f.required}
                      value={createValues[f.name] ?? ""}
                      onChange={(e) =>
                        setCreateValues((s) => ({ ...s, [f.name]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="gradient-brand text-white border-0" onClick={submitCreate}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ── Table card ── */}
      <div className="glass rounded-2xl">
        {/* Search bar */}
        <div className="p-4 border-b border-border/40 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="pl-9"
            />
          </div>
          <Badge variant="outline">
            {loading ? "Loading…" : `${filtered.length} of ${rows.length}`}
          </Badge>
        </div>

        {/* Horizontally scrollable table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={String(c.key)} className={c.className}>
                    {c.header}
                  </TableHead>
                ))}
                <TableHead className="text-right sticky right-0 bg-background/80 backdrop-blur-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((r) => (
                <TableRow key={String(r.id)}>
                  {columns.map((c) => (
                    <TableCell key={String(c.key)} className={c.className}>
                      {c.render
                        ? c.render(r)
                        : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                    </TableCell>
                  ))}

                  {/* Actions — sticky on the right */}
                  <TableCell className="text-right sticky right-0 bg-background/80 backdrop-blur-sm">
                    {canEdit && (
                      <Dialog
                        open={editOpen && activeRow?.id === r.id}
                        onOpenChange={(open) => {
                          if (!open) setActiveRow(null);
                          setEditOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(r)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>

                        {/* ── Edit Dialog — scrollable ── */}
                        <DialogContent className="max-h-[90vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>{edit!.title}</DialogTitle>
                          </DialogHeader>
                          <div className="overflow-y-auto flex-1 grid gap-4 py-2 pr-1">
                            {edit!.fields.map((f) => (
                              <div key={f.name} className="grid gap-2">
                                <Label htmlFor={`edit-${f.name}`}>{f.label}</Label>
                                <Input
                                  id={`edit-${f.name}`}
                                  type={f.type ?? "text"}
                                  placeholder={f.placeholder}
                                  required={f.required}
                                  value={editValues[f.name] ?? ""}
                                  onChange={(e) =>
                                    setEditValues((s) => ({ ...s, [f.name]: e.target.value }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          <DialogFooter className="pt-2">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              className="gradient-brand text-white border-0"
                              onClick={submitEdit}
                            >
                              Save
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete record?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => submitDelete(r.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center text-muted-foreground py-8"
                  >
                    No records.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}