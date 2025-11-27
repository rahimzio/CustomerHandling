// src/pages/customers/CustomerDetailPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import type { Customer } from "../../types/customer";
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
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const collectionName = useCustomerCollectionName();
  const [type, setType] = useState<"private" | "company">("private");

  useEffect(() => {
    if (customer) setType(customer.type);
  }, [customer]);

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Kundendetails</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType("private")}
            className={`px-3 py-2 rounded-md border text-sm transition ${type === "private"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-500"
              }`}
          >
            Privatperson
          </button>

          <button
            type="button"
            onClick={() => setType("company")}
            className={`px-3 py-2 rounded-md border text-sm transition ${type === "company"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-500"
              }`}
          >
            Unternehmen
          </button>


        </div>
      </div>

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Straße</div>
            <div>{customer.street}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Stadt</div>
            <div>{customer.city}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Postleitzahl</div>
            <div>{customer.postalCode}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Land</div>
            <div>{customer.country}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
