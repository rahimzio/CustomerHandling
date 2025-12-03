// src/pages/customers/CustomerForm.tsx
import { useState, type FormEvent } from "react";
import type {
  Customer,
  CustomerStatus,
  CustomerType,
} from "../../types/customer";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface CustomerFormProps {
  initial: Partial<Customer>;
  onSubmit: (data: Partial<Customer>) => Promise<void> | void;
  submitLabel: string;
  isEdit: boolean;
}

export function CustomerForm({
  initial,
  onSubmit,
  submitLabel,
  isEdit,
}: CustomerFormProps) {
  const [type, setType] = useState<CustomerType>(
    (initial.type as CustomerType) ?? "private"
  );

  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [companyName, setCompanyName] = useState(
    initial.companyName ?? ""
  );

  const [street, setStreet] = useState(initial.street ?? "");
  const [postalCode, setPostalCode] = useState(
    initial.postalCode ?? ""
  );
  const [city, setCity] = useState(initial.city ?? "");
  const [country, setCountry] = useState(initial.country ?? "");

  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");

  const [status, setStatus] = useState<CustomerStatus>(
    (initial.status as CustomerStatus) ?? "active"
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data: Partial<Customer> = {
      ...initial,
      type,
      firstName,
      lastName,
      companyName,
      street,
      postalCode,
      city,
      country,
      email,
      phone,
    };

    // Status nur explizit mitschicken, wenn es einen gibt:
    // - im Edit-Modus (User kann ihn ändern)
    // - oder initial bereits gesetzt war
    if (isEdit || initial.status) {
      data.status = status;
    }

    await onSubmit(data);
  };

  const showPrivateFields = type === "private";
  const showCompanyFields = type === "company";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Kundentyp-Toggle */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-zinc-700">
          Kundentyp *
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("private")}
            className={`px-3 py-2 rounded-md border text-sm transition ${
              type === "private"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-500"
            }`}
          >
            Privatperson
          </button>

          <button
            type="button"
            onClick={() => setType("company")}
            className={`px-3 py-2 rounded-md border text-sm transition ${
              type === "company"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-500"
            }`}
          >
            Unternehmen
          </button>
        </div>
      </div>

      {/* Status – nur im Edit-Modus anzeigen */}
      {isEdit && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-700">
            Aktivitätsstatus
          </div>
          <div className="flex rounded-md border border-zinc-200 overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setStatus("active")}
              className={`px-3 py-2 text-sm transition ${
                status === "active"
                  ? "bg-beige-900 text-white"
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Aktiv
            </button>
            <button
              type="button"
              onClick={() => setStatus("inactive")}
              className={`px-3 py-2 text-sm transition border-l border-zinc-200 ${
                status === "inactive"
                  ? "bg-beige-900 text-white"
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Inaktiv
            </button>
          </div>
        </div>
      )}

      {/* Felder für Privatperson */}
      {showPrivateFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Vorname *
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nachname *
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Mustermann"
            />
          </div>
        </div>
      )}

      {/* Felder für Unternehmen */}
      {showCompanyFields && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Firmenname *
          </label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Musterfirma GmbH"
          />
        </div>
      )}

      {/* Kontakt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            E-Mail
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kunde@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Telefon
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+49 ..."
          />
        </div>
      </div>

      {/* Adresse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Straße
          </label>
          <Input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Musterstraße 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Stadt
          </label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Köln"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Postleitzahl
          </label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="50667"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Land
          </label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Deutschland"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
