import Link from "next/link";
import { getClients } from "@/lib/actions/clients";
import {
  getActiveCheckIns,
  getRecentCheckIns,
  getMonitoringOverview,
} from "@/lib/actions/monitoring";
import { PageHeader } from "@/components/PageHeader";
import { CheckInPanel } from "@/components/CheckInPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatRelative } from "@/lib/utils";

export default async function MonitoringPage() {
  const [overview, activeClients, activeCheckIns, recentCheckIns] =
    await Promise.all([
      getMonitoringOverview(),
      getClients("ACTIVE"),
      getActiveCheckIns(),
      getRecentCheckIns(40),
    ]);

  return (
    <div>
      <PageHeader
        title="Client monitoring"
        description="Live attendance, check-ins, and progress notes"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-red-900/40 bg-red-950/30 p-4">
          <p className="text-sm text-red-300/80">In gym now</p>
          <p className="mt-1 text-3xl font-bold text-red-400">
            {overview.activeInGym}
          </p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-4">
          <p className="text-sm text-zinc-400">Check-ins today</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {overview.todayCheckIns}
          </p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-4">
          <p className="text-sm text-zinc-400">Active members</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {overview.activeClients}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <CheckInPanel
          activeClients={activeClients}
          activeCheckIns={activeCheckIns}
        />

        <section className="rounded-xl border border-[#2a2a2a] bg-[#111]/80 p-5">
          <h2 className="mb-4 font-semibold text-white">Recent notes</h2>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {overview.recentNotes.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-[#2a2a2a] px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <Link
                    href={`/clients/${n.clientId}`}
                    className="text-sm font-medium text-white hover:text-red-400"
                  >
                    {n.client.name}
                  </Link>
                  <StatusBadge status={n.type} />
                </div>
                <p className="text-sm text-zinc-400">{n.content}</p>
                <p className="mt-1 text-xs text-zinc-600">
                  {formatRelative(n.createdAt)}
                </p>
              </li>
            ))}
            {overview.recentNotes.length === 0 && (
              <p className="text-sm text-zinc-500">No monitoring notes yet</p>
            )}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#111]/80">
        <h2 className="border-b border-[#2a2a2a] px-5 py-4 font-semibold text-white">
          Attendance log
        </h2>
        <ul className="divide-y divide-zinc-800">
          {recentCheckIns.map((ci) => (
            <li
              key={ci.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <Link
                  href={`/clients/${ci.clientId}`}
                  className="font-medium text-white hover:text-red-400"
                >
                  {ci.client.name}
                </Link>
                <p className="text-xs text-zinc-500">
                  In: {formatDateTime(ci.checkedInAt)}
                  {ci.checkedOutAt &&
                    ` · Out: ${formatDateTime(ci.checkedOutAt)}`}
                </p>
              </div>
              {!ci.checkedOutAt && (
                <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs text-red-400">
                  Active
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
