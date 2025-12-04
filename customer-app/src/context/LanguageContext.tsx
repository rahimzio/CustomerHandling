// src/context/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
    type ReactNode,
} from "react";

export type LanguageCode = "de" | "en";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

// einfache Schlüssel-basierte Übersetzungen
const translations: Record<LanguageCode, Record<string, string>> = {
  de: {
    // Common
    "common.dashboard": "Dashboard",
    "common.cancel": "Abbrechen",
    "common.apply": "Anwenden",
    "common.reset": "Zurücksetzen",

    // Sidebar
    "sidebar.menu": "Menü",
    "sidebar.customers": "Kunden",
    "sidebar.settings": "Einstellungen",
    "sidebar.logout": "Abmelden",

    // Topbar / Seiten
    "page.customers": "Kunden",
    "page.settings": "Einstellungen",
    "page.overview": "Übersicht",

    // CustomersPage
    "customers.title": "Kunden",
    "customers.newCustomer": "+ Neuer Kunde",
    "customers.kpi.total": "Gesamtkunden",
    "customers.kpi.active": "Aktive Kunden",
    "customers.kpi.newThisMonth": "Neue Kunden (Monat)",
    "customers.searchPlaceholder": "Kunden suchen...",
    "customers.filter": "Filter",

    "customers.table.name": "Name",
    "customers.table.type": "Typ",
    "customers.table.country": "Land",
    "customers.table.status": "Status",
    "customers.table.actions": "Aktionen",

    "customers.type.private": "Privat",
    "customers.type.company": "Unternehmen",

    "customers.status.active": "Aktiv",
    "customers.status.inactive": "Inaktiv",

    "customers.empty": "Keine Kunden gefunden.",

    "customers.filter.title": "Filter",
    "customers.filter.type": "Typ",
    "customers.filter.status": "Status",
    "customers.filter.country": "Land",
    "customers.filter.all": "Alle",
    "customers.filter.allCountries": "Alle Länder",

    "customers.dialog.deleteTitle": "Kundenlöschung bestätigen",
    "customers.dialog.deleteText":
      "Sind Sie sicher, dass Sie diesen Kunden löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    "customers.dialog.deleteConfirm": "Löschen bestätigen",

    // Settings
    "settings.title": "Einstellungen",
    "settings.subtitle":
      "Verwalten Sie Ihre Profilinformationen und die Sprache der Anwendung.",
    "settings.profile.title": "Profil",
    "settings.profile.firstName": "Vorname",
    "settings.profile.lastName": "Nachname",
    "settings.profile.description":
      "Die Initialen in der Kopfzeile werden aus Vor- und Nachname gebildet (z. B. Umut Mershken → UM).",

    "settings.language.title": "Sprache",
    "settings.language.fieldLabel": "Anwendungssprache",
    "settings.language.description":
      "Wählen Sie die Sprache der Benutzeroberfläche.",

    "settings.save": "Einstellungen speichern",
    "settings.loading": "Einstellungen werden geladen...",
    "settings.saveSuccess": "Einstellungen wurden gespeichert.",
    "settings.saveError": "Einstellungen konnten nicht gespeichert werden.",
  },

  en: {
    // Common
    "common.dashboard": "Dashboard",
    "common.cancel": "Cancel",
    "common.apply": "Apply",
    "common.reset": "Reset",

    // Sidebar
    "sidebar.menu": "Menu",
    "sidebar.customers": "Customers",
    "sidebar.settings": "Settings",
    "sidebar.logout": "Log out",

    // Topbar / Seiten
    "page.customers": "Customers",
    "page.settings": "Settings",
    "page.overview": "Overview",

    // CustomersPage
    "customers.title": "Customers",
    "customers.newCustomer": "+ New customer",
    "customers.kpi.total": "Total customers",
    "customers.kpi.active": "Active customers",
    "customers.kpi.newThisMonth": "New customers (month)",
    "customers.searchPlaceholder": "Search customers...",
    "customers.filter": "Filter",

    "customers.table.name": "Name",
    "customers.table.type": "Type",
    "customers.table.country": "Country",
    "customers.table.status": "Status",
    "customers.table.actions": "Actions",

    "customers.type.private": "Private",
    "customers.type.company": "Company",

    "customers.status.active": "Active",
    "customers.status.inactive": "Inactive",

    "customers.empty": "No customers found.",

    "customers.filter.title": "Filter",
    "customers.filter.type": "Type",
    "customers.filter.status": "Status",
    "customers.filter.country": "Country",
    "customers.filter.all": "All",
    "customers.filter.allCountries": "All countries",

    "customers.dialog.deleteTitle": "Confirm customer deletion",
    "customers.dialog.deleteText":
      "Are you sure you want to delete this customer? This action cannot be undone.",
    "customers.dialog.deleteConfirm": "Confirm deletion",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle":
      "Manage your profile information and the application language.",
    "settings.profile.title": "Profile",
    "settings.profile.firstName": "First name",
    "settings.profile.lastName": "Last name",
    "settings.profile.description":
      "The initials in the header are built from first and last name (e.g. Umut Mershken → UM).",

    "settings.language.title": "Language",
    "settings.language.fieldLabel": "Application language",
    "settings.language.description":
      "Choose the language of the user interface.",

    "settings.save": "Save settings",
    "settings.loading": "Loading settings...",
    "settings.saveSuccess": "Settings have been saved.",
    "settings.saveError": "Settings could not be saved.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("de");

  useEffect(() => {
    const stored = localStorage.getItem("appLanguage") as LanguageCode | null;
    if (stored === "de" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const t = (key: string) => {
    const value = translations[language][key];
    if (value) return value;
    // Fallback: deutsch oder Key
    return translations.de[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
