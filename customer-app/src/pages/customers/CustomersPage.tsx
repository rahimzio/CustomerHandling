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
import { useLanguage } from "../../context/LanguageContext";

export function CustomersPage() {
  const { t } = useLanguage();

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

  const renderStatusBadge = (status: Customer["status"] | undefined) => {
    const current = status ?? "active";
    return (
      <Badge
        variant="outline"
        className={
          current === "active"
            ? "border-green-500 text-green-600"
            : "border-zinc-400 text-zinc-500"
        }
      >
        {current === "active"
          ? t("customers.status.active")
          : t("customers.status.inactive")}
      </Badge>
    );
  };

  return (
    <>
      <div className="w-full px-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">
            {t("customers.title")}
          </h1>
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/customers/new")}
          >
            {t("customers.newCustomer")}
          </Button>
        </div>

        {/* KPI-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                {t("customers.kpi.total")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold">{total}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                {t("customers.kpi.active")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold">{active}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-zinc-500">
                {t("customers.kpi.newThisMonth")}
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
            placeholder={t("customers.searchPlaceholder")}
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
                <path d="M4 4h16l-6 7v7l-4-2v-5z" />
              </svg>
            </span>
            <span className="text-white">
              {t("customers.filter")}
            </span>
          </Button>
        </div>

        {/* Desktop: eine Tabelle mit sticky Header + scrollbarem Body */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[45vh] overflow-y-auto border border-zinc-200 rounded-md">
                <Table className="min-w-[650px]">
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>{t("customers.table.name")}</TableHead>
                      <TableHead>{t("customers.table.type")}</TableHead>
                      <TableHead>{t("customers.table.country")}</TableHead>
                      <TableHead>{t("customers.table.status")}</TableHead>
                      <TableHead className="w-[180px] text-right">
                        {t("customers.table.actions")}
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

                        const isInactive = (c.status ?? "active") === "inactive";

                        return (
                          <TableRow
                            key={c.id}
                            className={isInactive ? "bg-zinc-50" : ""}
                          >
                            {/* Name */}
                            <TableCell className="whitespace-nowrap">
                              {name}
                            </TableCell>

                            {/* Typ */}
                            <TableCell>
                              <Badge variant="outline">
                                {c.type === "company"
                                  ? t("customers.type.company")
                                  : t("customers.type.private")}
                              </Badge>
                            </TableCell>

                            {/* Land */}
                            <TableCell>
                              {c.country}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              {renderStatusBadge(c.status)}
                            </TableCell>

                            {/* Aktionen */}
                            <TableCell className="text-right space-x-1 sm:space-x-2">
                              <Button
                                variant="default"
                                size="icon"
                                className="bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900"
                                onClick={() => navigate(`/customers/${c.id}`)}
                                aria-label="Details anzeigen"
                              >
                                👁
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900"
                                onClick={() => navigate(`/customers/${c.id}/edit`)}
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
                          colSpan={5}
                          className="text-center py-6"
                        >
                          {t("customers.empty")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Mobile: Karten-Layout (statt Tabelle) */}
        <div className="space-y-3 md:hidden">
          {filtered.length > 0 ? (
            filtered.map((c) => {
              const name =
                c.type === "company"
                  ? c.companyName
                  : `${c.firstName} ${c.lastName}`;

              const isInactive = (c.status ?? "active") === "inactive";

              return (
                <Card
                  key={c.id}
                  className={isInactive ? "bg-zinc-50" : "bg-white"}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Name + Typ */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-sm text-zinc-500">
                          {t("customers.table.name")}
                        </div>
                        <div className="font-medium break-words">
                          {name}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-zinc-500">
                          {t("customers.table.type")}
                        </div>
                        <Badge variant="outline">
                          {c.type === "company"
                            ? t("customers.type.company")
                            : t("customers.type.private")}
                        </Badge>
                      </div>
                    </div>

                    {/* Land + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-zinc-500">
                          {t("customers.table.country")}
                        </div>
                        <div className="text-sm">
                          {c.country ?? "—"}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-zinc-500 mb-1">
                          {t("customers.table.status")}
                        </div>
                        {renderStatusBadge(c.status)}
                      </div>
                    </div>

                    {/* Aktionen */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="text-xs text-zinc-400">
                        {t("customers.table.actions")}
                      </div>
                      <div className="space-x-1">
                        <Button
                          variant="default"
                          size="icon-sm"
                          className="bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900"
                          onClick={() => navigate(`/customers/${c.id}`)}
                          aria-label="Details anzeigen"
                        >
                          👁
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
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
                          size="icon-sm"
                          className="bg-zinc-900 text-red-500 border border-zinc-900 hover:bg-white hover:text-red-500"
                          onClick={() => setDeleteId(c.id!)}
                          aria-label="Löschen"
                        >
                          🗑
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-sm text-zinc-500">
                {t("customers.empty")}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Filter-Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("customers.filter.title")}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Typ-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">
                {t("customers.filter.type")}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterType === "all"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.filter.all")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("private")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterType === "private"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.type.private")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("company")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterType === "company"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.type.company")}
                </button>
              </div>
            </div>

            {/* Status-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">
                {t("customers.filter.status")}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterStatus === "all"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.filter.all")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("active")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterStatus === "active"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.status.active")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${filterStatus === "inactive"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600"
                    }`}
                >
                  {t("customers.status.inactive")}
                </button>
              </div>
            </div>

            {/* Länder-Filter */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">
                {t("customers.filter.country")}
              </div>
              <select
                className="w-full h-9 border border-zinc-200 rounded-md px-2 text-sm bg-white"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="all">
                  {t("customers.filter.allCountries")}
                </option>
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
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                resetFilters();
                setIsFilterOpen(false);
              }}
            >
              {t("common.reset")}
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFilterOpen(false)}
            >
              {t("common.apply")}
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
            <DialogTitle>
              {t("customers.dialog.deleteTitle")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600 mt-2">
            {t("customers.dialog.deleteText")}
          </p>
          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              {t("customers.dialog.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
