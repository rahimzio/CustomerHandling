// src/types/customer.ts
export type CustomerType = "company" | "private";
export type CustomerStatus = "active" | "inactive";

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

  // Aktivitäts-Status (aktiv / inaktiv)
  status?: CustomerStatus;

  /**
   * Unix-Timestamp (ms) der Erstellung.
   * Wird von createCustomer gesetzt.
   */
  createdAt?: number;

  /**
   * Unix-Timestamp (ms) der letzten Änderung.
   * Wird von createCustomer / updateCustomer gesetzt.
   */
  updatedAt?: number;
}
