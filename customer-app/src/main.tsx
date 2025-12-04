import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthModeProvider } from "./context/AuthModeContext";
import { LanguageProvider } from "./context/LanguageContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthModeProvider>
        <LanguageProvider>
        <App />
      </LanguageProvider>
      </AuthModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
