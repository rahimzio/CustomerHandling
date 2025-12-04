// src/hook/useCustomerCollectionName.ts
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const BASE_COLLECTION = "customers";

export function useCustomerCollectionName() {
  const [collectionName, setCollectionName] = useState<string>(
    `${BASE_COLLECTION}_public`
  );

  useEffect(() => {
    const storedMode = localStorage.getItem("authMode") as
      | "guest"
      | "user"
      | null;

    if (storedMode === "guest") {
      setCollectionName(`${BASE_COLLECTION}_public`);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCollectionName(`${BASE_COLLECTION}_${user.uid}`);
      } else {
        setCollectionName(`${BASE_COLLECTION}_public`);
      }
    });

    return () => unsubscribe();
  }, []);

  return collectionName;
}
