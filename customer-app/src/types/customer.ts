// src/types/customer.ts
export type CustomerType = "company" | "private";

export interface Customer {
  id?: string; // Firestore-Dokument-ID
  type: CustomerType;

  // für private Kunden
  firstName?: string;
  lastName?: string;

  // für Firmenkunden
  companyName?: string;

  // Adresse
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;

 // Kontakt
  email?: string;
  phone?: string;

  createdAt: number;
  updatedAt: number;
}
