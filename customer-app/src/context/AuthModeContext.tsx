import React, { createContext, useContext, useState } from "react";

type Mode = "guest" | "user";

type AuthModeContextValue = {
  // Current auth mode (guest or user)
  mode: Mode | null;
  // Email of the logged-in user (if available)
  userEmail?: string;
  // Update auth mode and optional user email
  setMode: (mode: Mode, email?: string) => void;
};

// React context holding auth mode state
const AuthModeContext = createContext<AuthModeContextValue | undefined>(
  undefined
);

// Provider component wrapping parts of the app that need auth mode
export const AuthModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setModeState] = useState<Mode | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  // Helper to update mode and email together
  const setMode = (m: Mode, email?: string) => {
    setModeState(m);
    setUserEmail(email);
  };

  return (
    <AuthModeContext.Provider value={{ mode, userEmail, setMode }}>
      {children}
    </AuthModeContext.Provider>
  );
};

// Hook to access auth mode context in components
export const useAuthMode = () => {
  const ctx = useContext(AuthModeContext);
  if (!ctx) {
    throw new Error("useAuthMode must be used within AuthModeProvider");
  }
  return ctx;
};
