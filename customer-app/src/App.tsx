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
  // Controls mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Routes that should show the auth layout instead of the main app
  const authRoutes = ["/"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  // Render login page with a centered layout for auth routes
  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 overflow-x-hidden">
        <LoginPage />
      </div>
    );
  }

  // Main application layout with sidebar + topbar + routed content
  return (
    <div className="min-h-screen w-full bg-zinc-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Persistent sidebar (collapsible on mobile) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Top navigation bar with sidebar toggle */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Main routed content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            <Routes>
              {/* Customers list */}
              <Route path="/customers" element={<CustomersPage />} />

              {/* Create new customer */}
              <Route path="/customers/new" element={<CustomerFormPage />} />

              {/* Edit existing customer */}
              <Route
                path="/customers/:id/edit"
                element={<CustomerFormPage />}
              />

              {/* Customer detail view */}
              <Route
                path="/customers/:id"
                element={<CustomerDetailPage />}
              />

              {/* Settings page */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Fallback: redirect unknown routes to customers list */}
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
