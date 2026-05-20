import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/utils";

const colors: Record<string, string> = {
  ACTIVE: "bg-red-600/20 text-red-400 border-red-600/30",
  INACTIVE: "bg-zinc-800/80 text-zinc-400 border-zinc-700",
  SUSPENDED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PAID: "bg-red-600/20 text-red-400 border-red-600/30",
  OVERDUE: "bg-red-900/40 text-red-300 border-red-700/50",
  PARTIAL: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MONITORING: "bg-red-600/15 text-red-400 border-red-900/40",
  HEALTH: "bg-zinc-700/50 text-zinc-300 border-zinc-600",
  PAYMENT: "bg-red-950/50 text-red-300 border-red-800/50",
  GENERAL: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors[status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
