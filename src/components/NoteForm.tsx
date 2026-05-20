"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea, Select } from "./Input";
import { Button } from "./Button";
import { addClientNote } from "@/lib/actions/monitoring";

export function NoteForm({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    const form = new FormData(formEl);
    try {
      await addClientNote(
        clientId,
        form.get("content") as string,
        form.get("type") as "GENERAL" | "MONITORING" | "HEALTH" | "PAYMENT"
      );
      formEl.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-zinc-400">Add note for {clientName}</p>
      <Select name="type" label="Note type" defaultValue="MONITORING">
        <option value="MONITORING">Monitoring</option>
        <option value="HEALTH">Health</option>
        <option value="PAYMENT">Payment</option>
        <option value="GENERAL">General</option>
      </Select>
      <Textarea name="content" label="Note" required rows={3} />
      <Button type="submit" size="sm" disabled={loading}>
        Add note
      </Button>
    </form>
  );
}
