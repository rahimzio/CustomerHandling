// src/App.tsx
import { Sidebar } from "./components/ui/Layout/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Topbar } from "./components/ui/Layout/Topbar";
import { CustomersPage } from "./pages/customers/CustomersPage";
import { CustomerFormPage } from "./pages/customers/CustomerFormPage";
import { CustomerDetailPage } from "./pages/customers/CustomerDetailPage";
import { useState } from "react";
import { LoginPage } from "./pages/authauth/LoginPage";
import { SettingsPage } from "./pages/settings/SettingsPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const authRoutes = ["/"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 overflow-x-hidden">
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            <Routes>
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route
                path="/customers/:id/edit"
                element={<CustomerFormPage />}
              />
              <Route
                path="/customers/:id"
                element={<CustomerDetailPage />}
              />
              <Route path="/settings" element={<SettingsPage />} />

              <Route
                path="*"
                element={<Navigate to="/customers" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
