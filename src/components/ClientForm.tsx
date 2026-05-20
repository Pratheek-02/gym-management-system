"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Select } from "./Input";
import { Button } from "./Button";
import { createClient, updateClient } from "@/lib/actions/clients";
import type { Client, MembershipPlan } from "@/generated/prisma/client";

type ClientFormProps = {
  plans: MembershipPlan[];
  client?: Client & { membershipPlan?: MembershipPlan | null };
};

export function ClientForm({ plans, client }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState(client?.membershipPlanId ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      email: (form.get("email") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      emergencyContact: (form.get("emergencyContact") as string) || undefined,
      monthlyFee: parseFloat(form.get("monthlyFee") as string),
      membershipPlanId: planId || undefined,
      status: (form.get("status") as "ACTIVE" | "INACTIVE" | "SUSPENDED") || "ACTIVE",
    };

    try {
      if (client) {
        await updateClient(client.id, data);
        router.push(`/clients/${client.id}`);
      } else {
        const created = await createClient(data);
        router.push(`/clients/${created.id}`);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function onPlanChange(id: string) {
    setPlanId(id);
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      const feeInput = document.getElementById("monthlyFee") as HTMLInputElement;
      if (feeInput) feeInput.value = String(plan.monthlyFee);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <Input
        label="Full name"
        name="name"
        required
        defaultValue={client?.name}
        placeholder="Client name"
      />
      <Input
        label="Phone"
        name="phone"
        required
        defaultValue={client?.phone}
        placeholder="10-digit mobile"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={client?.email ?? ""}
        placeholder="optional@email.com"
      />
      <Select
        label="Membership plan"
        value={planId}
        onChange={(e) => onPlanChange(e.target.value)}
      >
        <option value="">Custom fee</option>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — ₹{p.monthlyFee}/mo
          </option>
        ))}
      </Select>
      <Input
        label="Monthly fee (₹)"
        name="monthlyFee"
        id="monthlyFee"
        type="number"
        required
        min={0}
        step={100}
        defaultValue={client?.monthlyFee ?? ""}
      />
      <Select label="Status" name="status" defaultValue={client?.status ?? "ACTIVE"}>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="SUSPENDED">Suspended</option>
      </Select>
      <Input
        label="Address"
        name="address"
        defaultValue={client?.address ?? ""}
      />
      <Input
        label="Emergency contact"
        name="emergencyContact"
        defaultValue={client?.emergencyContact ?? ""}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : client ? "Update client" : "Add client"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
