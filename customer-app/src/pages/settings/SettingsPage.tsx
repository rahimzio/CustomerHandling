// src/pages/settings/SettingsPage.tsx
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useLanguage, type LanguageCode } from "../../context/LanguageContext";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  language?: LanguageCode;
  updatedAt?: number;
}

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  const [profileId, setProfileId] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (id: string, emailHint?: string | null) => {
    const ref = doc(db, "profiles", id);
    const snap = await getDoc(ref);

    let data: UserProfile | null = null;
    if (snap.exists()) {
      data = snap.data() as UserProfile;
    }

    const profileLang: LanguageCode =
      data?.language ?? (localStorage.getItem("appLanguage") as LanguageCode) ?? "de";

    setFirstName(data?.firstName ?? "");
    setLastName(data?.lastName ?? "");

    // Wenn kein Name gesetzt, versuche aus E-Mail abzuleiten
    if (!data?.firstName && emailHint) {
      const namePart = emailHint.split("@")[0];
      if (namePart) {
        const parts = namePart.replace(/\./g, " ").split(" ");
        if (parts[0]) setFirstName(capitalize(parts[0]));
        if (parts[1]) setLastName(capitalize(parts[1]));
      }
    }

    // Globale Sprache setzen -> UI springt um
    setLanguage(profileLang);

    setProfileId(id);
    setLoading(false);
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;

    const mode =
      (localStorage.getItem("authMode") as "guest" | "user" | null) ?? "guest";

    if (mode === "guest") {
      loadProfile("guest").catch((err) => {
        console.error(err);
        setError(t("settings.saveError"));
        setLoading(false);
      });
    } else {
      unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          loadProfile(user.uid, user.email).catch((err) => {
            console.error(err);
            setError(t("settings.saveError"));
            setLoading(false);
          });
        } else {
          loadProfile("guest").catch((err) => {
            console.error(err);
            setError(t("settings.saveError"));
            setLoading(false);
          });
        }
      });
    }

    return () => {
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const ref = doc(db, "profiles", profileId);
      const payload: UserProfile = {
        firstName: firstName.trim() || "",
        lastName: lastName.trim() || "",
        language,
        updatedAt: Date.now(),
      };

      await setDoc(ref, payload, { merge: true });

      setMessage(t("settings.saveSuccess"));
    } catch (err) {
      console.error(err);
      setError(t("settings.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 text-sm text-zinc-500">
        {t("settings.loading")}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>
        <p className="text-sm text-zinc-500">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {message && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          {message}
        </div>
      )}

      {/* Profilinformationen */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">
                {t("settings.profile.firstName")}
              </label>
              <Input
                placeholder="z. B. Umut"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">
                {t("settings.profile.lastName")}
              </label>
              <Input
                placeholder="z. B. Mershken"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            {t("settings.profile.description")}
          </p>
        </CardContent>
      </Card>

      {/* Sprache */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.language.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              {t("settings.language.fieldLabel")}
            </label>
            <select
              className="w-full h-9 border border-zinc-200 rounded-md px-2 text-sm bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
          <p className="text-xs text-zinc-500">
            {t("settings.language.description")}
          </p>
        </CardContent>
      </Card>

      {/* Speichern-Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "..." : t("settings.save")}
        </Button>
      </div>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
