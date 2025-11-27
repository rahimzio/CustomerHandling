// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthMode } from "../../context/AuthModeContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export function LoginPage() {
  const { setMode } = useAuthMode();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGuest = () => {
    setMode("guest");
    navigate("/customers");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Bitte E-Mail eingeben (Demo-Login ohne echte Prüfung).");
      return;
    }
    setMode("user", email);
    navigate("/customers");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
          Anmelden
        </h1>
        <p className="text-center text-sm text-zinc-500 mb-6">
          Greifen Sie auf Ihr Konto zu oder nutzen Sie den Gastzugang.
        </p>

        {/* Gastzugang prominent */}
        <div className="mb-6">
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2"
            onClick={handleGuest}
          >
            Gastzugang nutzen
          </Button>
          <p className="mt-2 text-xs text-center text-zinc-500">
            Ideal zum schnellen Testen der Kundenverwaltung.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">oder mit Konto</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Social Buttons – optional / nur UI */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <FcGoogle className="h-4 w-4" />
            Mit Google anmelden
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <FaApple className="h-4 w-4" />
            Mit Apple anmelden
          </Button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ihr Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-50"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Anmelden
          </Button>
        </form>
      </div>
    </div>
  );
}
