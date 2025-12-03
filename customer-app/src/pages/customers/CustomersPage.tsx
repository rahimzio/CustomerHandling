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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "private" | "company">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");

  const navigate = useNavigate();
  const collectionName = useCustomerCollectionName();

  useEffect(() => {
    (async () => {
      const data = await getCustomers(collectionName);
      setCustomers(data);
    })();
  }, [collectionName]);

  // Länder-Liste für Filter (einzigartige, sortierte Länder)
  const countryOptions = Array.from(
    new Set(
      customers
        .map((c) => c.country)
        .filter((c): c is string => !!c && c.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filtered = customers.filter((c) => {
    // Name-Filter (Suche)
    const name =
      c.type === "company"
        ? c.companyName ?? ""
        : `${c.firstName ?? ""} ${c.lastName ?? ""}`;
    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Typ-Filter
    if (filterType !== "all" && c.type !== filterType) {
      return false;
    }

    // Status-Filter
    const status = (c.status ?? "active") as "active" | "inactive";
    if (filterStatus !== "all" && status !== filterStatus) {
      return false;
    }

    // Länder-Filter
    if (
      filterCountry !== "all" &&
      (c.country ?? "").trim() !== filterCountry
    ) {
      return false;
    }

    return true;
  });

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteCustomer(collectionName, deleteId);
    setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  // KPI-Berechnungen
  const total = customers.length;

  const active = customers.filter(
    (c) => (c.status ?? "active") === "active"
  ).length;

  const now = new Date();
  const newThisMonth = customers.filter((c) => {
    if (!c.createdAt) return false;
    const d = new Date(c.createdAt);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  }).length;

  const resetFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterCountry("all");
  };

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
              <span className="text-3xl font-semibold">
                {newThisMonth}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Suchleiste + Filter-Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Input
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Button
            type="button"
            variant="default"
            className="sm:w-auto flex items-center gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
            {/* Trichter-Icon */}
            <span className="inline-flex items-center justify-center">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Einfaches Funnel-Icon */}
                <path d="M4 4h16l-6 7v7l-4-2v-5z" />
              </svg>
            </span>
            {/* Text klar weiß */}
            <span className="text-white">Filter</span>
          </Button>
        </div>


        {/* Tabelle mit fixem Header + scrollbarem Body */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {/* Rahmen um Header + Body gemeinsam */}
              <div className="border border-zinc-200 rounded-md">
                {/* Fester Header – bewegt sich NICHT beim Scrollen */}
                <Table className="min-w-[650px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-white">Name</TableHead>
                      <TableHead className="bg-white">Typ</TableHead>
                      <TableHead className="bg-white">Land</TableHead>
                      <TableHead className="bg-white w-[180px] text-right">
                        Aktionen
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>

                {/* Scrollbarer Body */}
                <div className="max-h-[45vh] overflow-y-auto">
                  <Table className="min-w-[650px]">
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
                                  className="bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900"
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
                                  className="bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900"
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
                                  className="bg-zinc-900 text-red-500 border border-zinc-900 hover:bg-white hover:text-red-500"
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
                          <TableCell
                            colSpan={4}
                            className="text-center py-6"
                          >
                            Keine Kunden gefunden.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter-Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Typ-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">Typ</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterType === "all"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Alle
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("private")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterType === "private"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Privat
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("company")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterType === "company"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Unternehmen
                </button>
              </div>
            </div>

            {/* Status-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">Status</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterStatus === "all"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Alle
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("active")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterStatus === "active"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Aktiv
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    filterStatus === "inactive"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  Inaktiv
                </button>
              </div>
            </div>

            {/* Länder-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">Land</div>
              <select
                className="w-full h-9 border border-zinc-200 rounded-md px-2 text-sm bg-white"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="all">Alle Länder</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="default"
              className="w-full sm:w-auto"
              onClick={() => {
                resetFilters();
                setIsFilterOpen(false);
              }}
            >
              Zurücksetzen
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFilterOpen(false)}
            >
              Anwenden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            Sind Sie sicher, dass Sie diesen Kunden löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="default"
              onClick={() => setDeleteId(null)}
              className="w-full sm:w-auto"
            >
              Abbrechen
            </Button>
            <Button
              variant="reddefault"
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
