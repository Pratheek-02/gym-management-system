"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "./Input";
import { Button } from "./Button";
import { recordPayment } from "@/lib/actions/payments";
import type { Client, FeeInvoice } from "@/generated/prisma/client";

type PaymentFormProps = {
  clients: Client[];
  pendingInvoices?: (FeeInvoice & { client: Client })[];
  defaultClientId?: string;
  defaultInvoiceId?: string;
};

export function PaymentForm({
  clients,
  pendingInvoices = [],
  defaultClientId,
  defaultInvoiceId,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [invoiceId, setInvoiceId] = useState(defaultInvoiceId ?? "");

  const clientInvoices = pendingInvoices.filter((i) => i.clientId === clientId);
  const selectedInvoice = clientInvoices.find((i) => i.id === invoiceId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    const form = new FormData(formEl);
    try {
      await recordPayment({
        clientId: form.get("clientId") as string,
        feeInvoiceId: (form.get("feeInvoiceId") as string) || undefined,
        amount: parseFloat(form.get("amount") as string),
        method: form.get("method") as "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "OTHER",
        reference: (form.get("reference") as string) || undefined,
        notes: (form.get("notes") as string) || undefined,
      });
      formEl.reset();
      setInvoiceId("");
      setClientId("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[#2a2a2a] bg-[#111] p-6">
      <h3 className="font-semibold text-white">Record payment</h3>
      <Select
        label="Client"
        name="clientId"
        required
        value={clientId}
        onChange={(e) => {
          setClientId(e.target.value);
          setInvoiceId("");
        }}
      >
        <option value="">Select client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.phone}
          </option>
        ))}
      </Select>
      {clientInvoices.length > 0 && (
        <Select
          label="Link to invoice (optional)"
          name="feeInvoiceId"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
        >
          <option value="">General payment</option>
          {clientInvoices.map((i) => (
            <option key={i.id} value={i.id}>
              Due {new Date(i.dueDate).toLocaleDateString()} — ₹
              {i.amount - i.amountPaid} remaining
            </option>
          ))}
        </Select>
      )}
      <Input
        label="Amount (₹)"
        name="amount"
        type="number"
        required
        min={1}
        defaultValue={
          selectedInvoice
            ? String(selectedInvoice.amount - selectedInvoice.amountPaid)
            : undefined
        }
      />
      <Select label="Payment method" name="method" defaultValue="UPI">
        <option value="CASH">Cash</option>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
        <option value="OTHER">Other</option>
      </Select>
      <Input label="Reference / txn ID" name="reference" placeholder="Optional" />
      <Textarea label="Notes" name="notes" rows={2} placeholder="Optional" />
      <Button type="submit" disabled={loading || !clientId}>
        {loading ? "Recording…" : "Record payment"}
      </Button>
    </form>
  );
}
