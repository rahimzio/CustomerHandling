// src/components/ui/Layout/Topbar.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../../../context/LanguageContext";

interface TopbarProps {
  // Triggered when user taps the menu button (mobile)
  onToggleSidebar: () => void;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  language?: string;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const [initials, setInitials] = useState<string>("");

  // Localized breadcrumb page title
  const currentPage = getPageTitle(location.pathname, t);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    // Determine if we are in guest or user mode
    const mode =
      (localStorage.getItem("authMode") as "guest" | "user" | null) ?? "guest";

    // Load profile initials based on profile id and optional email
    const loadAndSetInitials = async (
      profileId: string,
      emailHint?: string | null
    ) => {
      try {
        const ref = doc(db, "profiles", profileId);
        const snap = await getDoc(ref);

        let profile: UserProfile | null = null;
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
        }

        if (!active) return;

        const initialsComputed = computeInitials(
          profile?.firstName,
          profile?.lastName,
          emailHint
        );
        setInitials(initialsComputed);
      } catch (err) {
        console.error(err);
        if (!active) return;
        // Fallback to generic initial for guest
        setInitials("G");
      }
    };

    // For guests, always use "guest" profile
    if (mode === "guest") {
      loadAndSetInitials("guest", null);
    } else {
      // For logged-in users, listen to auth changes and load profile
      unsub = onAuthStateChanged(auth, (user) => {
        if (!active) return;

        if (user) {
          loadAndSetInitials(user.uid, user.email);
        } else {
          loadAndSetInitials("guest", null);
        }
      });
    }

    // Cleanup on unmount / effect re-run
    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, []);

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4 sm:px-6">
      {/* Left side: menu toggle (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden text-zinc-600 hover:text-zinc-900"
          onClick={onToggleSidebar}
          aria-label="Menü öffnen"
        >
          ☰
        </button>
        <div className="text-sm">
          <span className="text-zinc-400">
            {t("common.dashboard")} /{" "}
          </span>
          <span className="font-medium text-zinc-800">{currentPage}</span>
        </div>
      </div>

      {/* Right side: user initials avatar */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold uppercase">
          {initials || "G"}
        </div>
      </div>
    </header>
  );
}

// Map current route to a translated page title
function getPageTitle(pathname: string, t: (k: string) => string): string {
  if (pathname.startsWith("/settings")) return t("page.settings");
  if (pathname.startsWith("/customers")) return t("page.customers");
  return t("page.overview");
}

// Compute two-letter initials from profile data or email
function computeInitials(
  firstName?: string,
  lastName?: string,
  email?: string | null
): string {
  const f = (firstName ?? "").trim();
  const l = (lastName ?? "").trim();

  // Full first + last name
  if (f && l) {
    return (f[0] + l[0]).toUpperCase();
  }

  // Only first name available
  if (f) {
    if (f.length >= 2) return f.slice(0, 2).toUpperCase();
    return f[0].toUpperCase();
  }

  // Derive initials from email prefix if possible
  if (email) {
    const namePart = email.split("@")[0] ?? "";
    if (namePart.length >= 2) return namePart.slice(0, 2).toUpperCase();
    if (namePart.length === 1) return namePart.toUpperCase();
  }

  // Default fallback
  return "G";
}
