"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  Activity,
  Dumbbell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/fees", label: "Fees & Pending", icon: Receipt },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/settings", label: "Customize Gym", icon: Settings },
];

type SidebarProps = {
  gymName: string;
  tagline: string;
  footerNote?: string | null;
};

export function Sidebar({ gymName, tagline, footerNote }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#2a2a2a] bg-black">
      <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20 text-red-500 ring-1 ring-red-600/40">
          <Dumbbell className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-white">
            {gymName}
          </h1>
          <p className="truncate text-xs text-zinc-500">{tagline}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-red-600/20 text-red-400 ring-1 ring-red-900/50"
                  : "text-zinc-400 hover:bg-[#1a1a1a] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#2a2a2a] px-6 py-4">
        <p className="text-xs text-zinc-600">
          {footerNote ||
            "Manage clients, fees, payments & attendance"}
        </p>
      </div>
    </aside>
  );
}
