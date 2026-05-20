import Link from "next/link";
import { getInvoices, generateMonthlyInvoicesForAll } from "@/lib/actions/fees";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getGymSettings } from "@/lib/actions/settings";

export default async function FeesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter as "pending" | "overdue" | undefined;
  const [settings, invoices] = await Promise.all([
    getGymSettings(),
    getInvoices(filter ?? "all"),
  ]);
  const currency = settings.currency;

  const pending = invoices.filter(
    (i) => i.status === "PENDING" || i.status === "PARTIAL"
  );
  const overdue = invoices.filter(
    (i) =>
      i.status === "OVERDUE" ||
      (i.status === "PENDING" && new Date(i.dueDate) < new Date())
  );
  const pendingTotal = pending.reduce(
    (s, i) => s + (i.amount - i.amountPaid),
    0
  );
  const overdueTotal = overdue.reduce(
    (s, i) => s + (i.amount - i.amountPaid),
    0
  );

  async function generateAll() {
    "use server";
    await generateMonthlyInvoicesForAll();
  }

  const tabs = [
    { label: "All invoices", href: "/fees" },
    { label: "Pending", href: "/fees?filter=pending" },
    { label: "Overdue", href: "/fees?filter=overdue" },
  ];

  const display =
    filter === "pending"
      ? pending
      : filter === "overdue"
        ? overdue
        : invoices;

  return (
    <div>
      <PageHeader
        title="Fees & pending payments"
        description="Track monthly fees, pending balances, and overdue accounts"
        action={
          <form action={generateAll}>
            <Button type="submit" variant="secondary">
              Generate monthly fees (all active)
            </Button>
          </form>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200/80">Pending fees</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">
            {formatCurrency(pendingTotal, currency)}
          </p>
          <p className="text-xs text-zinc-500">{pending.length} invoices</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200/80">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-400">
            {formatCurrency(overdueTotal, currency)}
          </p>
          <p className="text-xs text-zinc-500">{overdue.length} invoices</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-4">
          <p className="text-sm text-zinc-400">Total invoices</p>
          <p className="mt-1 text-2xl font-bold text-white">{invoices.length}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg border border-[#2a2a2a] bg-[#111] p-1 w-fit">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              (filter === "pending" && tab.href.includes("pending")) ||
              (filter === "overdue" && tab.href.includes("overdue")) ||
              (!filter && tab.href === "/fees")
                ? "bg-red-600/20 text-red-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#2a2a2a] bg-[#111] text-zinc-400">
            <tr>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Paid</th>
              <th className="px-5 py-3 font-medium">Balance</th>
              <th className="px-5 py-3 font-medium">Due date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {display.map((inv) => (
              <tr key={inv.id} className="hover:bg-red-950/20">
                <td className="px-5 py-3">
                  <Link
                    href={`/clients/${inv.clientId}`}
                    className="font-medium text-white hover:text-red-400"
                  >
                    {inv.client.name}
                  </Link>
                  <p className="text-xs text-zinc-500">{inv.client.phone}</p>
                </td>
                <td className="px-5 py-3">{formatCurrency(inv.amount, currency)}</td>
                <td className="px-5 py-3 text-zinc-400">
                  {formatCurrency(inv.amountPaid, currency)}
                </td>
                <td className="px-5 py-3 font-medium text-amber-400">
                  {formatCurrency(inv.amount - inv.amountPaid, currency)}
                </td>
                <td className="px-5 py-3 text-zinc-400">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/payments?client=${inv.clientId}&invoice=${inv.id}`}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Record payment
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {display.length === 0 && (
          <p className="py-12 text-center text-zinc-500">No invoices in this view</p>
        )}
      </div>
    </div>
  );
}
