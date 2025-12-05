// src/hook/useCustomerCollectionName.ts
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const BASE_COLLECTION = "customers";

// Hook that returns the current Firestore collection name for customers
export function useCustomerCollectionName() {
  // Default to public collection
  const [collectionName, setCollectionName] = useState<string>(
    `${BASE_COLLECTION}_public`
  );

  useEffect(() => {
    // Read last selected auth mode from localStorage
    const storedMode = localStorage.getItem("authMode") as
      | "guest"
      | "user"
      | null;

    // If user is explicitly in guest mode, always use public collection
    if (storedMode === "guest") {
      setCollectionName(`${BASE_COLLECTION}_public`);
      return;
    }

    // Listen for Firebase auth state changes to switch collection per user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Authenticated user: use user-specific collection
        setCollectionName(`${BASE_COLLECTION}_${user.uid}`);
      } else {
        // No user: fall back to public collection
        setCollectionName(`${BASE_COLLECTION}_public`);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribe();
  }, []);

  // Expose the resolved collection name
  return collectionName;
}
