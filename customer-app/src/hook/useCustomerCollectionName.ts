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
    // Erst schauen, ob explizit Gastmodus gesetzt wurde
    const storedMode = localStorage.getItem("authMode") as
      | "guest"
      | "user"
      | null;

    if (storedMode === "guest") {
      setCollectionName(`${BASE_COLLECTION}_public`);
      return;
    }

    // Wenn kein Gast: auf Auth-State hören
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Eigene Collection pro User
        setCollectionName(`${BASE_COLLECTION}_${user.uid}`);
      } else {
        // Nicht eingeloggt -> Gast als Fallback
        setCollectionName(`${BASE_COLLECTION}_public`);
      }
    });

    return () => unsubscribe();
  }, []);

  return collectionName;
}
