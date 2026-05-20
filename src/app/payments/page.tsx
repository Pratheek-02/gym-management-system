import { getPayments } from "@/lib/actions/payments";
import { getClients } from "@/lib/actions/clients";
import { getInvoices } from "@/lib/actions/fees";
import { PageHeader } from "@/components/PageHeader";
import { PaymentForm } from "@/components/PaymentForm";
import {
  formatCurrency,
  formatDate,
  PAYMENT_METHOD_LABELS,
} from "@/lib/utils";
import { getGymSettings } from "@/lib/actions/settings";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; invoice?: string }>;
}) {
  const params = await searchParams;
  const [payments, invoices, settings] = await Promise.all([
    getPayments(100),
    getInvoices("pending"),
    getGymSettings(),
  ]);
  const currency = settings.currency;

  const allClients = await getClients();

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Record and view all client payment transactions"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PaymentForm
            clients={allClients}
            pendingInvoices={invoices}
            defaultClientId={params.client}
            defaultInvoiceId={params.invoice}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#2a2a2a] bg-[#111] text-zinc-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Method</th>
                  <th className="px-5 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-red-950/20">
                    <td className="px-5 py-3 text-zinc-400">
                      {formatDate(p.paidAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-white">
                        {p.client.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-red-400">
                      {formatCurrency(p.amount, currency)}
                    </td>
                    <td className="px-5 py-3 text-zinc-400">
                      {PAYMENT_METHOD_LABELS[p.method]}
                    </td>
                    <td className="px-5 py-3 text-zinc-500">
                      {p.reference ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <p className="py-12 text-center text-zinc-500">
                No payments recorded yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
