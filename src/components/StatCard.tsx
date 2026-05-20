import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "danger";
};

const variants = {
  default: "bg-[#111] border-[#2a2a2a] text-white",
  warning: "bg-amber-950/30 border-amber-800/40 text-amber-400",
  success: "bg-red-950/20 border-red-900/40 text-red-400",
  danger: "bg-red-950/50 border-red-700/50 text-red-300",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow hover:shadow-lg hover:shadow-red-900/10",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg bg-black/50 p-2 ring-1 ring-[#333]">
          <Icon className="h-5 w-5 opacity-80" />
        </div>
      </div>
    </div>
  );
}
