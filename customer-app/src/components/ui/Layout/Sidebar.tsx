// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { Separator } from "@radix-ui/react-select";
import { cn } from "../../../lib/utils";
import { Home, Settings, LogOut } from "lucide-react";
import { useAuthMode } from "../../../context/AuthModeContext";

type SidebarProps = {
  isOpen: boolean;
};

export function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const { setMode } = useAuthMode();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
      isActive
        ? "bg-zinc-100 text-zinc-900"
        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
    );

  const handleLogout = () => {
    setMode("guest");
    navigate("/"); // zurück zur Login-/Gast-Seite
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  return (
    <aside
      className={cn(
        "bg-white border-r w-64 flex flex-col transition-transform duration-200",
        // auf kleinen Screens als Offcanvas
        "fixed inset-y-0 left-0 z-40 md:static",
        "h-screen md:h-auto",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="px-4 py-4 font-semibold text-lg">Kundenverwaltung</div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        <NavLink to="/customers" className={linkClasses}>
          <Home className="h-4 w-4" />
          <span>Kunden</span>
        </NavLink>
      </nav>

      <Separator />
      <div className="p-3 space-y-1 text-sm border-t bg-white">
        <button
          type="button"
          onClick={handleOpenSettings}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <Settings className="h-4 w-4" />
          <span>Einstellungen</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
