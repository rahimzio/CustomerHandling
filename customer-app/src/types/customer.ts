// src/types/customer.ts

// Distinguishes between business and private customers
export type CustomerType = "company" | "private";

// Activity state of a customer
export type CustomerStatus = "active" | "inactive";

export interface Customer {
  // Firestore document ID (optional because it is added after creation)
  id?: string;

  // Customer category (company or private)
  type: CustomerType;

  // Personal customer name
  firstName?: string;
  lastName?: string;

  // Company name for business customers
  companyName?: string;

  // Address information
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;

  // Contact details
  email?: string;
  phone?: string;

  // Active vs. inactive customer
  status?: CustomerStatus;

  // Creation timestamp (ms since epoch)
  createdAt?: number;

  // Last update timestamp (ms since epoch)
  updatedAt?: number;
}
