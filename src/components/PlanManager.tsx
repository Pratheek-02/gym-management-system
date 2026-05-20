"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Input, Textarea } from "./Input";
import { Button } from "./Button";
import {
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "@/lib/actions/settings";
import { useGym } from "./GymProvider";
import { formatCurrency } from "@/lib/utils";
import type { MembershipPlan } from "@/generated/prisma/client";

export function PlanManager({ plans }: { plans: MembershipPlan[] }) {
  const { currency } = useGym();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    const form = new FormData(formEl);
    try {
      await createMembershipPlan({
        name: form.get("name") as string,
        monthlyFee: parseFloat(form.get("monthlyFee") as string),
        description: (form.get("description") as string) || undefined,
      });
      formEl.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(
    id: string,
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await updateMembershipPlan(id, {
        name: form.get("name") as string,
        monthlyFee: parseFloat(form.get("monthlyFee") as string),
        description: (form.get("description") as string) || undefined,
      });
      setEditingId(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plan? Clients on this plan keep their current fee."))
      return;
    setLoading(true);
    try {
      await deleteMembershipPlan(id);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5 space-y-4"
      >
        <h3 className="font-semibold text-white">Add membership plan</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Plan name" name="name" required placeholder="Premium" />
          <Input
            label="Monthly fee"
            name="monthlyFee"
            type="number"
            required
            min={0}
            step={100}
          />
        </div>
        <Textarea label="Description" name="description" rows={2} />
        <Button type="submit" size="sm" disabled={loading}>
          <Plus className="mr-1 h-4 w-4" />
          Add plan
        </Button>
      </form>

      <ul className="space-y-3">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="rounded-xl border border-[#2a2a2a] bg-[#111] p-4"
          >
            {editingId === plan.id ? (
              <form onSubmit={(e) => handleUpdate(plan.id, e)} className="space-y-3">
                <Input label="Name" name="name" defaultValue={plan.name} required />
                <Input
                  label="Monthly fee"
                  name="monthlyFee"
                  type="number"
                  defaultValue={plan.monthlyFee}
                  required
                />
                <Textarea
                  label="Description"
                  name="description"
                  rows={2}
                  defaultValue={plan.description ?? ""}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={loading}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{plan.name}</p>
                  <p className="text-lg font-bold text-red-400">
                    {formatCurrency(plan.monthlyFee, currency)}/mo
                  </p>
                  {plan.description && (
                    <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(plan.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(plan.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
        {plans.length === 0 && (
          <p className="text-sm text-zinc-500">No plans yet. Add your first plan above.</p>
        )}
      </ul>
    </div>
  );
}
