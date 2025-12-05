// src/pages/authauth/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();

  // Auth mode: login or register
  const [mode, setMode] = useState<"login" | "register">("login");
  // Email / password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  // Handle email/password login or registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // Mark user mode in localStorage so app uses private collections
      localStorage.setItem("authMode", "user");

      // Redirect to customers dashboard
      navigate("/customers");
    } catch (err: any) {
      console.error("Auth error:", err?.code, err?.message, err);
      // Map Firebase error codes to user-friendly messages
      let msg = "Es ist ein Fehler aufgetreten.";
      if (err?.code === "auth/user-not-found")
        msg = "Kein Benutzer mit dieser E-Mail gefunden.";
      if (err?.code === "auth/wrong-password")
        msg = "Falsches Passwort.";
      if (err?.code === "auth/email-already-in-use")
        msg = "Diese E-Mail wird bereits verwendet.";
      if (err?.code === "auth/invalid-email")
        msg = "Bitte eine gültige E-Mail-Adresse eingeben.";
      if (err?.code === "auth/weak-password")
        msg = "Das Passwort ist zu schwach (mind. 6 Zeichen).";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);

      // Logged-in users use private collections
      localStorage.setItem("authMode", "user");

      navigate("/customers");
    } catch (err) {
      console.error(err);
      setError("Google-Anmeldung ist fehlgeschlagen.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest mode (no authenticated user, use public collections)
  const handleGuestLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // Ensure we are fully signed out before guest mode
      await signOut(auth).catch(() => {});

      localStorage.setItem("authMode", "guest");

      navigate("/customers");
    } catch (err) {
      console.error(err);
      setError("Gastzugang konnte nicht gestartet werden.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        {/* Title and short description */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Anmelden" : "Registrieren"}
          </h1>
          <p className="text-sm text-zinc-500">
            {isLogin
              ? "Melde dich mit deinem Konto an, um deine Kunden zu verwalten."
              : "Erstelle ein Konto, um deine Kunden zu verwalten."}
          </p>
        </div>

        {/* Toggle between login and register mode */}
        <div className="flex justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1.5 rounded-md border transition ${
              isLogin
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-500 border-zinc-200 hover:text-zinc-700"
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`px-3 py-1.5 rounded-md border transition ${
              !isLogin
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-500 border-zinc-200 hover:text-zinc-700"
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Error message box */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Email/password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              E-Mail
            </label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">
              Passwort
            </label>
            <Input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Bitte warten..."
              : isLogin
              ? "Anmelden"
              : "Registrieren"}
          </Button>
        </form>

        {/* Visual divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400 uppercase tracking-wide">
            oder
          </span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Google login button */}
        <Button
          type="button"
          variant="default"
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {/* Google icon */}
          <span className="inline-flex items-center justify-center rounded-full bg-white w-5 h-5">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-2 3.1l3.2 2.5C20.7 18.3 21.5 16.3 21.5 14c0-.7-.1-1.3-.2-1.9H12z"
              />
              <path
                fill="#34A853"
                d="M6.6 14.3l-.9.7-2.6 2C4.4 19.6 8 21.5 12 21.5c2.4 0 4.4-.8 5.9-2.3l-3.2-2.5c-.9.6-2 1-2.7 1-2.4 0-4.4-1.6-5.1-3.9z"
              />
              <path
                fill="#FBBC05"
                d="M3.1 7.2C2.4 8.5 2 10 2 11.5c0 1.5.4 3 1.1 4.3l3.5-2.7C6.3 12.4 6 11.7 6 11c0-.7.3-1.4.6-2L3.1 7.2z"
              />
              <path
                fill="#4285F4"
                d="M12 6.5c1.3 0 2.4.4 3.3 1.3l2.4-2.4C16.4 3.9 14.4 3 12 3 8 3 4.4 4.9 3.1 7.2l3.5 2.8C7.6 8 9.6 6.5 12 6.5z"
              />
            </svg>
          </span>
          <span className="text-white">Mit Google anmelden</span>
        </Button>

        {/* Guest mode button */}
        <Button
          type="button"
          variant="default"
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          <span>👤</span>
          <span className="text-white">Als Gast fortfahren</span>
        </Button>

        {/* Small legal note */}
        <p className="text-xs text-zinc-400 text-center">
          Durch die Anmeldung akzeptieren Sie die Nutzungsbedingungen und
          Datenschutzrichtlinien.
        </p>
      </div>
    </div>
  );
}
