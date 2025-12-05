// src/pages/customers/CustomerFormPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Customer } from "../../types/customer";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../services/customerService";
import { CustomerForm } from "./CustomerForm";
import { useCustomerCollectionName } from "../../hook/useCustomerCollectionName";

export function CustomerFormPage() {
  const navigate = useNavigate();
  // Read :id from route params to detect edit mode
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // Holds initial form values (for edit or create)
  const [initial, setInitial] = useState<Partial<Customer> | null>(
    null
  );
  // Resolve current Firestore collection name (user or public)
  const collectionName = useCustomerCollectionName();

  // Load existing customer data when editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        const data = await getCustomerById(collectionName, id);
        if (data) setInitial(data);
      })();
    } else {
      // For new customers, start with empty initial values
      setInitial({});
    }
  }, [isEdit, id, collectionName]);

  // Handle form submit for both create and update
  const handleSubmit = async (data: Partial<Customer>) => {
    if (isEdit && id) {
      // Update existing customer
      await updateCustomer(collectionName, id, data);
    } else {
      // Create new customer
      await createCustomer(
        collectionName,
        data as Omit<Customer, "id" | "createdAt" | "updatedAt">
      );
    }
    // Go back to customer list after saving
    navigate("/customers");
  };

  // Simple loading state while initial data is being fetched
  if (!initial) {
    return <div className="px-4 py-4">Kunde wird geladen...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 space-y-4">
      <div className="max-w-3xl mx-auto space-y-2">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Kundendaten bearbeiten" : "Neuen Kunden anlegen"}
        </h1>
        <p className="text-sm text-zinc-500">
          Geben Sie alle erforderlichen Informationen für das Kundenprofil
          ein. Felder mit einem Stern (*) sind Pflichtfelder.
        </p>
      </div>

      {/* Main customer form wrapper */}
      <div className="max-w-3xl mx-auto">
        <CustomerForm
          initial={initial}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? "Aktualisieren" : "Speichern"}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
}
