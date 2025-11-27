// src/components/customers/CustomerForm.tsx
import { useState } from "react";
import type { Customer, CustomerType } from "../../types/customer";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

type Props = {
  initial?: Partial<Customer>;
  onSubmit: (data: Partial<Customer>) => Promise<void> | void;
  submitLabel?: string;
};

export function CustomerForm({
  initial = {},
  onSubmit,
  submitLabel = "Speichern",
}: Props) {
  const [type, setType] = useState<CustomerType>(initial.type ?? "private");
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [companyName, setCompanyName] = useState(initial.companyName ?? "");
  const [street, setStreet] = useState(initial.street ?? "");
  const [postalCode, setPostalCode] = useState(initial.postalCode ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [country, setCountry] = useState(initial.country ?? "");
  const [email, setEmail] = useState((initial as any).email ?? "");
  const [phone, setPhone] = useState((initial as any).phone ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (type === "private") {
      if (!firstName) errors.push("Vorname ist erforderlich.");
      if (!lastName) errors.push("Nachname ist erforderlich.");
    }

    if (type === "company") {
      if (!companyName) errors.push("Unternehmensname ist erforderlich.");
    }

    const normalizedCountry = country.trim();
    if (!normalizedCountry) {
      errors.push("Land ist erforderlich.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      console.warn("Formularvalidierung fehlgeschlagen:", errors);
      return;
    }

    await onSubmit({
      type,
      firstName,
      lastName,
      companyName,
      street,
      postalCode,
      city,
      country: normalizedCountry,
      ...(email && { email }),
      ...(phone && { phone }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      {/* Kundentyp */}
      <div className="space-y-1">
        <Label>Kundentyp *</Label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setType("private")}
            className={`px-3 py-2 rounded-md border text-sm ${
              type === "private"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            Privatperson
          </button>
          <button
            type="button"
            onClick={() => setType("company")}
            className={`px-3 py-2 rounded-md border text-sm ${
              type === "company"
                ? "border-beige-900 bg-beige-900 text-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            Unternehmen
          </button>
        </div>
      </div>

      {/* Name */}
      {type === "private" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Vorname *</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label>Nachname *</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <Label>Unternehmensname *</Label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      )}

      {/* Adresse + Land */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Straße und Hausnummer</Label>
          <Input value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div>
          <Label>Ort</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <Label>PLZ</Label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div>
          <Label>Land *</Label>
          <select
            className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Land wählen</option>
            <option value="Deutschland">Deutschland</option>
            <option value="Österreich">Österreich</option>
            <option value="Schweiz">Schweiz</option>
            <option value="USA">USA</option>
          </select>
        </div>
      </div>

      {/* Kontakt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>E-Mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Telefonnummer (optional)</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
