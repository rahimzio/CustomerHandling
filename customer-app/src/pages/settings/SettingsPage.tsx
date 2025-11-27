// src/pages/settings/SettingsPage.tsx
import { Switch } from "@radix-ui/react-switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { useAuthMode } from "../../context/AuthModeContext";

export function SettingsPage() {
  const { mode, userEmail } = useAuthMode();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-4 sm:py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Einstellungen</h1>

        {/* Konto / Modus */}
        <Card>
          <CardHeader>
            <CardTitle>Konto & Datenbank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-600">
            <p>
              Aktueller Modus:{" "}
              <span className="font-medium">
                {mode === "guest" || !mode
                  ? "Gastzugang (öffentliche Demo-Daten)"
                  : "Eigenes Konto"}
              </span>
            </p>
            {mode === "user" && (
              <p className="break-all">
                Angemeldet als:{" "}
                <span className="font-mono">{userEmail}</span>
              </p>
            )}
            <p className="text-xs text-zinc-500 leading-relaxed">
              Im Gastmodus werden Daten in einer öffentlichen Demo-Collection
              gespeichert. Im Benutzer-Modus wird pro E-Mail eine eigene
              Collection angelegt.
            </p>
          </CardContent>
        </Card>

        {/* Darstellung / Theme – nur UI, Funktion können wir später einbauen */}
        <Card>
          <CardHeader>
            <CardTitle>Darstellung</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Label className="font-medium">Dark Mode</Label>
              <p className="text-xs text-zinc-500">
                Später: Umschalten zwischen hellem und dunklem Layout.
              </p>
            </div>
            <Switch />
          </CardContent>
        </Card>

        {/* Datenverwaltung – Platzhalter für Zukunft */}
        <Card>
          <CardHeader>
            <CardTitle>Datenverwaltung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-600">
            <p className="text-xs text-zinc-500">
              Geplante Features:
            </p>
            <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1">
              <li>Demo-Daten im Gastmodus zurücksetzen</li>
              <li>Export der eigenen Kunden als CSV/JSON</li>
              <li>E-Mail des Kontos ändern</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
