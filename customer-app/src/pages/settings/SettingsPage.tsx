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

  // Current profile document id (user uid or "guest")
  const [profileId, setProfileId] = useState<string | null>(null);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load profile data for given id, optionally using email as a name hint
  const loadProfile = async (id: string, emailHint?: string | null) => {
    const ref = doc(db, "profiles", id);
    const snap = await getDoc(ref);

    let data: UserProfile | null = null;
    if (snap.exists()) {
      data = snap.data() as UserProfile;
    }

    // Determine language: profile -> localStorage -> default "de"
    const profileLang: LanguageCode =
      data?.language ??
      (localStorage.getItem("appLanguage") as LanguageCode) ??
      "de";

    setFirstName(data?.firstName ?? "");
    setLastName(data?.lastName ?? "");

    // If no name saved yet, try to infer from email (before "@")
    if (!data?.firstName && emailHint) {
      const namePart = emailHint.split("@")[0];
      if (namePart) {
        const parts = namePart.replace(/\./g, " ").split(" ");
        if (parts[0]) setFirstName(capitalize(parts[0]));
        if (parts[1]) setLastName(capitalize(parts[1]));
      }
    }

    setLanguage(profileLang);

    setProfileId(id);
    setLoading(false);
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;

    // Read auth mode (guest vs user) from localStorage
    const mode =
      (localStorage.getItem("authMode") as "guest" | "user" | null) ??
      "guest";

    // Guest mode always uses a shared "guest" profile
    if (mode === "guest") {
      loadProfile("guest").catch((err) => {
        console.error(err);
        setError(t("settings.saveError"));
        setLoading(false);
      });
    } else {
      // In user mode, listen to Firebase auth state
      unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged-in user: load personal profile by uid
          loadProfile(user.uid, user.email).catch((err) => {
            console.error(err);
            setError(t("settings.saveError"));
            setLoading(false);
          });
        } else {
          // No user: fall back to guest profile
          loadProfile("guest").catch((err) => {
            console.error(err);
            setError(t("settings.saveError"));
            setLoading(false);
          });
        }
      });
    }

    // Cleanup auth listener on unmount
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Persist profile changes to Firestore
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

  // Simple loading state while profile is being fetched
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
        <p className="text-sm text-zinc-500">{t("settings.subtitle")}</p>
      </div>

      {/* Feedback messages */}
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

      {/* Profile information */}
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

      {/* Language settings */}
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

      {/* Feature overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.features.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600">
          <p>{t("settings.features.intro")}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("settings.features.items.customerCrud")}</li>
            <li>{t("settings.features.items.customerStatus")}</li>
            <li>{t("settings.features.items.filtering")}</li>
            <li>{t("settings.features.items.responsive")}</li>
            <li>{t("settings.features.items.auth")}</li>
            <li>{t("settings.features.items.separation")}</li>
            <li>{t("settings.features.items.profile")}</li>
            <li>{t("settings.features.items.language")}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "..." : t("settings.save")}
        </Button>
      </div>
    </div>
  );
}

// Capitalize first letter and lowercase the rest
function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
