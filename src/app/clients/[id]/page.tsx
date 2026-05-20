import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Receipt } from "lucide-react";
import { getClient } from "@/lib/actions/clients";
import { createMonthlyInvoice } from "@/lib/actions/fees";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { NoteForm } from "@/components/NoteForm";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  PAYMENT_METHOD_LABELS,
} from "@/lib/utils";
import { getGymSettings } from "@/lib/actions/settings";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, settings] = await Promise.all([
    getClient(id),
    getGymSettings(),
  ]);
  const currency = settings.currency;

  if (!client) notFound();

  async function generateInvoice() {
    "use server";
    await createMonthlyInvoice(id);
  }

  const pendingBalance = client.invoices
    .filter((i) => i.status !== "PAID")
    .reduce((s, i) => s + (i.amount - i.amountPaid), 0);

  return (
    <div>
      <PageHeader
        title={client.name}
        description={`${client.phone}${client.email ? ` · ${client.email}` : ""}`}
        action={
          <div className="flex gap-2">
            <form action={generateInvoice}>
              <Button type="submit" variant="secondary">
                <Receipt className="mr-2 h-4 w-4" />
                Generate fee
              </Button>
            </form>
            <Link href={`/clients/${id}/edit`}>
              <Button variant="secondary">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <DeleteClientButton clientId={id} clientName={client.name} />
          </div>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500">Status</p>
          <div className="mt-2">
            <StatusBadge status={client.status} />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500">Monthly fee</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatCurrency(client.monthlyFee, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500">Plan</p>
          <p className="mt-2 font-medium text-white">
            {client.membershipPlan?.name ?? "Custom"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500">Outstanding balance</p>
          <p
            className={`mt-2 text-lg font-semibold ${
              pendingBalance > 0 ? "text-amber-400" : "text-red-400"
            }`}
          >
            {formatCurrency(pendingBalance, currency)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="mb-4 font-semibold text-white">Fee history</h2>
          <ul className="space-y-2">
            {client.invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">
                    {formatCurrency(inv.amount, currency)}
                    {inv.amountPaid > 0 && inv.amountPaid < inv.amount && (
                      <span className="text-zinc-500">
                        {" "}
                        ({formatCurrency(inv.amountPaid, currency)} paid)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <StatusBadge status={inv.status} />
              </li>
            ))}
            {client.invoices.length === 0 && (
              <p className="text-sm text-zinc-500">No invoices yet</p>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="mb-4 font-semibold text-white">Payment history</h2>
          <ul className="space-y-2">
            {client.payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-red-400">
                    {formatCurrency(p.amount, currency)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {PAYMENT_METHOD_LABELS[p.method]} · {formatDate(p.paidAt)}
                  </p>
                </div>
              </li>
            ))}
            {client.payments.length === 0 && (
              <p className="text-sm text-zinc-500">No payments yet</p>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="mb-4 font-semibold text-white">Attendance</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {client.checkIns.map((ci) => (
              <li
                key={ci.id}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-sm"
              >
                <span className="text-white">{formatDateTime(ci.checkedInAt)}</span>
                {ci.checkedOutAt ? (
                  <span className="text-zinc-500">
                    {" "}
                    → {formatDateTime(ci.checkedOutAt)}
                  </span>
                ) : (
                  <span className="ml-2 text-red-400">(in gym)</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="mb-4 font-semibold text-white">Monitoring notes</h2>
          <NoteForm clientId={client.id} clientName={client.name} />
          <ul className="mt-4 space-y-3">
            {client.notes.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <StatusBadge status={n.type} />
                  <span className="text-xs text-zinc-600">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">{n.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
