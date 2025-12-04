// src/types/customer.ts
export type CustomerType = "company" | "private";
export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id?: string; 
  type: CustomerType;

  firstName?: string;
  lastName?: string;

  companyName?: string;

  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;

  email?: string;
  phone?: string;

  status?: CustomerStatus;

  createdAt?: number;

  updatedAt?: number;
}
