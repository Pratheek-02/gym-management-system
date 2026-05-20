import Link from "next/link";
import {
  Users,
  UserCheck,
  AlertCircle,
  IndianRupee,
  Activity,
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils";
import { getGymSettings } from "@/lib/actions/settings";

export default async function DashboardPage() {
  const [stats, settings] = await Promise.all([
    getDashboardStats(),
    getGymSettings(),
  ]);
  const { currency } = settings;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of clients, fees, revenue, and gym activity"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total clients"
          value={stats.totalClients}
          icon={Users}
        />
        <StatCard
          title="Active members"
          value={stats.activeClients}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Pending fees"
          value={stats.pendingCount}
          subtitle={formatCurrency(stats.pendingAmount, currency)}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueCount}
          subtitle={formatCurrency(stats.overdueAmount, currency)}
          icon={AlertCircle}
          variant="danger"
        />
        <StatCard
          title="Revenue this month"
          value={formatCurrency(stats.monthlyRevenue, currency)}
          icon={IndianRupee}
          variant="success"
        />
        <StatCard
          title="In gym now"
          value={stats.activeInGym}
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="theme-card">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
            <h2 className="font-semibold text-white">Pending & overdue fees</h2>
            <Link href="/fees" className="theme-link text-sm">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[#2a2a2a]">
            {[
              ...new Map(
                [...stats.overdueInvoices, ...stats.pendingInvoices].map(
                  (inv) => [inv.id, inv]
                )
              ).values(),
            ]
              .slice(0, 6)
              .map((inv) => (
                <li key={inv.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <Link
                      href={`/clients/${inv.clientId}`}
                      className="font-medium text-white hover:text-red-400"
                    >
                      {inv.client.name}
                    </Link>
                    <p className="text-xs text-zinc-500">
                      Due {formatDate(inv.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-amber-400">
                      {formatCurrency(inv.amount - inv.amountPaid, currency)}
                    </p>
                    <StatusBadge status={inv.status} />
                  </div>
                </li>
              ))}
            {stats.pendingCount + stats.overdueCount === 0 && (
              <li className="px-5 py-8 text-center text-sm text-zinc-500">
                All fees are up to date
              </li>
            )}
          </ul>
        </section>

        <section className="theme-card">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
            <h2 className="font-semibold text-white">Recent payments</h2>
            <Link href="/payments" className="theme-link text-sm">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[#2a2a2a]">
            {stats.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-white">{p.client.name}</p>
                  <p className="text-xs text-zinc-500">
                    {formatRelative(p.paidAt)}
                  </p>
                </div>
                <p className="font-medium text-red-400">
                  {formatCurrency(p.amount, currency)}
                </p>
              </li>
            ))}
            {stats.recentPayments.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-zinc-500">
                No payments recorded yet
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
