// src/pages/customers/CustomerDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Customer, CustomerStatus } from "../../types/customer";
import { getCustomerById } from "../../services/customerService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useCustomerCollectionName } from "../../hook/useCustomerCollectionName";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const collectionName = useCustomerCollectionName();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getCustomerById(collectionName, id);
      if (data) setCustomer(data);
    })();
  }, [id, collectionName]);

  if (!customer) {
    return <div className="px-4 py-4">Kunde wird geladen...</div>;
  }

  const fullName =
    customer.type === "company"
      ? customer.companyName
      : `${customer.firstName} ${customer.lastName}`;

  const currentStatus: CustomerStatus =
    customer.status ?? "active";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 space-y-6">
      {/* Kopfbereich: nur Titel */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Kundendetails</h1>
      </div>

      {/* Persönliche Infos */}
      <Card>
        <CardHeader>
          <CardTitle>Persönliche Informationen</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Kundentyp</div>
            <Badge variant="outline">
              {customer.type === "company" ? "Unternehmen" : "Privat"}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Voller Name</div>
            <div className="break-words">{fullName}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Status</div>
            <Badge
              variant={
                currentStatus === "inactive" ? "secondary" : "outline"
              }
            >
              {currentStatus === "inactive" ? "Inaktiv" : "Aktiv"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Straße</div>
            <div>{customer.street || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Stadt</div>
            <div>{customer.city || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Postleitzahl</div>
            <div>{customer.postalCode || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Land</div>
            <div>{customer.country || "—"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Kontakt */}
      <Card>
        <CardHeader>
          <CardTitle>Kontakt</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">E-Mail</div>
            <div>{customer.email || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Telefon</div>
            <div>{customer.phone || "—"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
