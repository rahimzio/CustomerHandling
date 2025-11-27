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

export async function createCustomer(
  collectionName: string,
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
) {
  const timestamp = Date.now();
  const customerCollection = getCustomerCollection(collectionName);

  const docRef = await addDoc(customerCollection, {
    ...data,
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

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Customer),
  }));
}

export async function getCustomerById(
  collectionName: string,
  id: string
): Promise<Customer | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Customer),
  };
}

export async function updateCustomer(
  collectionName: string,
  id: string,
  data: Partial<Customer>
) {
  const docRef = doc(db, collectionName, id);

  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteCustomer(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
