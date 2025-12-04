// src/components/layout/AppLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar + Overlay */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Hauptbereich */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          {/* Burger-Button nur auf Mobile */}
          <button
            type="button"
            className="md:hidden text-zinc-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">Customer App</h1>
        </header>

        {/* Seiteninhalt */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
