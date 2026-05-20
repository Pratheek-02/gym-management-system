"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "./Input";
import { Button } from "./Button";
import { updateGymSettings } from "@/lib/actions/settings";
import type { GymSettings } from "@/generated/prisma/client";

export function SettingsForm({ settings }: { settings: GymSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const form = new FormData(e.currentTarget);
    try {
      await updateGymSettings({
        gymName: form.get("gymName") as string,
        tagline: form.get("tagline") as string,
        phone: (form.get("phone") as string) || undefined,
        email: (form.get("email") as string) || undefined,
        address: (form.get("address") as string) || undefined,
        currency: (form.get("currency") as string) || "INR",
        feeDueDay: parseInt(form.get("feeDueDay") as string, 10) || 10,
        openingHours: (form.get("openingHours") as string) || undefined,
        footerNote: (form.get("footerNote") as string) || undefined,
      });
      setSaved(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-4">
        <h3 className="font-semibold text-white">Your gym branding</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Customize the app name, contact info, and billing rules for your gym.
        </p>
      </div>

      <Input
        label="Gym name"
        name="gymName"
        required
        defaultValue={settings.gymName}
        placeholder="e.g. PowerFit Gym"
      />
      <Input
        label="Tagline / subtitle"
        name="tagline"
        required
        defaultValue={settings.tagline}
        placeholder="Shown in sidebar"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Phone"
          name="phone"
          defaultValue={settings.phone ?? ""}
          placeholder="Gym contact number"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={settings.email ?? ""}
        />
      </div>
      <Textarea
        label="Address"
        name="address"
        rows={2}
        defaultValue={settings.address ?? ""}
      />
      <Input
        label="Opening hours"
        name="openingHours"
        defaultValue={settings.openingHours ?? ""}
        placeholder="e.g. Mon–Sat 6am–10pm"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Currency code"
          name="currency"
          required
          defaultValue={settings.currency}
          placeholder="INR, USD, EUR…"
        />
        <Input
          label="Monthly fee due day (1–28)"
          name="feeDueDay"
          type="number"
          min={1}
          max={28}
          required
          defaultValue={settings.feeDueDay}
        />
      </div>
      <Textarea
        label="Footer note (optional)"
        name="footerNote"
        rows={2}
        defaultValue={settings.footerNote ?? ""}
        placeholder="Custom message in sidebar"
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save gym settings"}
        </Button>
        {saved && (
          <span className="text-sm text-red-400">Settings saved!</span>
        )}
      </div>
    </form>
  );
}
