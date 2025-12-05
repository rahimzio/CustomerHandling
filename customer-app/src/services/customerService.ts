// src/services/customerService.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Customer } from "../types/customer";

// Helper to get the customer collection reference by name
const getCustomerCollection = (collectionName: string) =>
  collection(db, collectionName);

// Normalize a Firestore document into a Customer object
const mapFirestoreDocToCustomer = (d: any): Customer => {
  const data = d.data() as any;

  const rawCreatedAt = data.createdAt;
  const rawUpdatedAt = data.updatedAt;

  // Ensure createdAt is always a number (fallback to 0)
  const createdAt =
    typeof rawCreatedAt === "number" ? rawCreatedAt : 0;

  // Ensure updatedAt is a number, fallback to createdAt or 0
  const updatedAt =
    typeof rawUpdatedAt === "number" ? rawUpdatedAt : createdAt || 0;

  // Default to "active" if status is missing or invalid
  const status =
    data.status === "inactive" ? "inactive" : "active";

  return {
    ...(data as Customer),
    id: d.id,
    status,
    createdAt,
    updatedAt,
  };
};

// Create a new customer document in the given collection
export async function createCustomer(
  collectionName: string,
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
) {
  const timestamp = Date.now();
  const customerCollection = getCustomerCollection(collectionName);

  // Force a valid status value ("active" by default)
  const status =
    data.status === "inactive" ? "inactive" : "active";

  const docRef = await addDoc(customerCollection, {
    ...data,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Return the new document ID for further use
  return docRef.id;
}

// Fetch all customers from the given collection
export async function getCustomers(
  collectionName: string
): Promise<Customer[]> {
  const customerCollection = getCustomerCollection(collectionName);
  const snapshot = await getDocs(customerCollection);

  return snapshot.docs.map((d) => mapFirestoreDocToCustomer(d));
}

// Fetch a single customer by ID or return null if not found
export async function getCustomerById(
  collectionName: string,
  id: string
): Promise<Customer | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return mapFirestoreDocToCustomer(snapshot);
}

// Update an existing customer and bump the updatedAt timestamp
export async function updateCustomer(
  collectionName: string,
  id: string,
  data: Partial<Customer>
) {
  const docRef = doc(db, collectionName, id);

  // Strip out id field if it is passed in accidentally
  const { id: _id, ...rest } = data as any;

  await updateDoc(docRef, {
    ...rest,
    updatedAt: Date.now(),
  });
}

// Delete a customer document by ID
export async function deleteCustomer(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
