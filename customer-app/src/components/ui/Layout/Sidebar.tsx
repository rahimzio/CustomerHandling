// src/components/ui/Layout/Sidebar.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useLanguage } from "../../../context/LanguageContext";
import { Button } from "../button";
import { Home } from "lucide-react";

interface SidebarProps {
  // Controls sidebar visibility on mobile
  isOpen: boolean;
  // Called when sidebar should be closed
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Navigation links shown in the sidebar
  const links = [
    { label: t("sidebar.customers"), path: "/customers", isHome: true },
    { label: t("sidebar.settings"), path: "/settings", isHome: false },
  ];

  // Navigate to a route and close sidebar on mobile
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // Sign out user, clear auth mode and go back to login
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch { }
    localStorage.removeItem("authMode");
    navigate("/");
    onClose();
  };

  return (
    <>
      {/* Main sidebar container (drawer on mobile, static on desktop) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
          transform transition-transform duration-200
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Sidebar header with title and close button on mobile */}
        <div className="flex items-center justify-between p-4 border-b md:border-b-0">
          <span className="font-semibold">{t("sidebar.menu")}</span>
          <button
            type="button"
            className="md:hidden text-zinc-500"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Button
                key={link.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-sm flex items-center gap-2 ${
                  isActive
                    ? "bg-zinc-900 text-white border border-indigo-500"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
                onClick={() => handleNavigate(link.path)}
              >
                {link.isHome && <Home className="h-4 w-4" />}
                <span>{link.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Logout button at the bottom */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            {t("sidebar.logout")}
          </Button>
        </div>
      </aside>

      {/* Backdrop behind mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
