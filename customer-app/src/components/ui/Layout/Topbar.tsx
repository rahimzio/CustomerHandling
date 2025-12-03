// src/components/layout/Topbar.tsx
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu } from "lucide-react";

type TopbarProps = {
  onToggleSidebar: () => void;
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger-Button nur auf kleinen Screens */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white p-2"
          onClick={onToggleSidebar}
          aria-label="Navigation öffnen"
        >
          <Menu className="h-4 w-4 text-zinc-700" />
        </button>

        <div className="text-xs sm:text-sm text-zinc-500 truncate max-w-[160px] sm:max-w-none">
          Dashboard / <span className="font-medium text-zinc-900">Kunden</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
       

        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
