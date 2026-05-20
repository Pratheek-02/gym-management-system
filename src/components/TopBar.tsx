"use client";

import { ClientSearch } from "./ClientSearch";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 -mx-8 -mt-8 mb-8 flex items-center justify-between border-b border-[#2a2a2a] bg-[#0a0a0a]/95 px-8 py-4 backdrop-blur-md">
      <div className="hidden sm:block">
        <p className="text-xs font-medium uppercase tracking-wider text-red-500/80">
          Gym Management
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ClientSearch />
      </div>
    </header>
  );
}
