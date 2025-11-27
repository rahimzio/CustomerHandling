// src/pages/customers/CustomersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomers,
  deleteCustomer,
} from "../../services/customerService";
import type { Customer } from "../../types/customer";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useCustomerCollectionName } from "../../hook/useCustomerCollectionName";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const navigate = useNavigate();
  const collectionName = useCustomerCollectionName();

  useEffect(() => {
    (async () => {
      const data = await getCustomers(collectionName);
      setCustomers(data);
    })();
  }, [collectionName]);

  const filtered = customers.filter((c) => {
    const name =
      c.type === "company"
        ? c.companyName ?? ""
        : `${c.firstName ?? ""} ${c.lastName ?? ""}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteCustomer(collectionName, deleteId);
    setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  const total = customers.length;
  const active = customers.length;
  const newThisMonth = customers.length;

  return (
    <>
      <div className="w-full px-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Kunden</h1>
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/customers/new")}
          >
            + Neuer Kunde
          </Button>
        </div>

        {/* KPI-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                Gesamtkunden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold">{total}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                Aktive Kunden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold">{active}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                Neue Kunden (Monat)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold">{newThisMonth}</span>
            </CardContent>
          </Card>
        </div>

        {/* Suchleiste */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Input
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>

        {/* Tabelle in scrollbarer Box */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[45vh] overflow-y-auto border border-zinc-200 rounded-md">
                <Table className="min-w-[650px]">
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Land</TableHead>
                      <TableHead className="w-[140px] text-right">
                        Aktionen
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length > 0 ? (
                      filtered.map((c) => {
                        const name =
                          c.type === "company"
                            ? c.companyName
                            : `${c.firstName} ${c.lastName}`;

                        return (
                          <TableRow key={c.id}>
                            <TableCell className="whitespace-nowrap">
                              {name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {c.type === "company"
                                  ? "Unternehmen"
                                  : "Privat"}
                              </Badge>
                            </TableCell>
                            <TableCell>{c.country}</TableCell>
                            <TableCell className="text-right space-x-1 sm:space-x-2">
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() =>
                                  navigate(`/customers/${c.id}`)
                                }
                                aria-label="Details anzeigen"
                              >
                                👁
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  navigate(`/customers/${c.id}/edit`)
                                }
                                aria-label="Bearbeiten"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => setDeleteId(c.id!)}
                                aria-label="Löschen"
                              >
                                🗑
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          Keine Kunden gefunden.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete-Dialog – mit shadcn, schön zentriert */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kundenlöschung bestätigen</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600 mt-2">
            Sind Sie sicher, dass Sie diesen Kunden löschen möchten? Diese
            Aktion kann nicht rückgängig gemacht werden.
          </p>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="w-full sm:w-auto"
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              Löschen bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
