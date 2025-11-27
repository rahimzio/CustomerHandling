import React, { createContext, useContext, useState } from "react";

type Mode = "guest" | "user";

type AuthModeContextValue = {
  mode: Mode | null;
  userEmail?: string;
  setMode: (mode: Mode, email?: string) => void;
};

const AuthModeContext = createContext<AuthModeContextValue | undefined>(
  undefined
);

export const AuthModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setModeState] = useState<Mode | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();

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

export const useAuthMode = () => {
  const ctx = useContext(AuthModeContext);
  if (!ctx) {
    throw new Error("useAuthMode must be used within AuthModeProvider");
  }
  return ctx;
};
