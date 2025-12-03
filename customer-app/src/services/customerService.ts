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

const getCustomerCollection = (collectionName: string) =>
  collection(db, collectionName);

// Hilfsfunktion: Firestore-Dokument → Customer mit Defaults
const mapFirestoreDocToCustomer = (d: any): Customer => {
  const data = d.data() as any;

  const rawCreatedAt = data.createdAt;
  const rawUpdatedAt = data.updatedAt;

  const createdAt =
    typeof rawCreatedAt === "number" ? rawCreatedAt : 0;

  const updatedAt =
    typeof rawUpdatedAt === "number" ? rawUpdatedAt : createdAt || 0;

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

export async function createCustomer(
  collectionName: string,
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
) {
  const timestamp = Date.now();
  const customerCollection = getCustomerCollection(collectionName);

  const status =
    data.status === "inactive" ? "inactive" : "active";

  const docRef = await addDoc(customerCollection, {
    ...data,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return docRef.id;
}

export async function getCustomers(
  collectionName: string
): Promise<Customer[]> {
  const customerCollection = getCustomerCollection(collectionName);
  const snapshot = await getDocs(customerCollection);

  return snapshot.docs.map((d) => mapFirestoreDocToCustomer(d));
}

export async function getCustomerById(
  collectionName: string,
  id: string
): Promise<Customer | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return mapFirestoreDocToCustomer(snapshot);
}

export async function updateCustomer(
  collectionName: string,
  id: string,
  data: Partial<Customer>
) {
  const docRef = doc(db, collectionName, id);

  // "id" nicht ins Dokument schreiben
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...rest } = data as any;

  await updateDoc(docRef, {
    ...rest,
    updatedAt: Date.now(),
  });
}

export async function deleteCustomer(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
