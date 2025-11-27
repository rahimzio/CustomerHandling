// src/hooks/useCustomerCollectionName.ts
import { useAuthMode } from "../context/AuthModeContext";

export function useCustomerCollectionName() {
  const { mode, userEmail } = useAuthMode();

  // Gastzugang oder noch kein Modus gesetzt -> öffentliche Collection
  if (mode === "guest" || !mode) {
    return "customers_public";
  }

  // sehr simple Trennung pro User (für Demo ausreichend)
  const sanitized = (userEmail || "user").replace(/[^a-zA-Z0-9]/g, "_");
  return `customers_${sanitized}`;
}
