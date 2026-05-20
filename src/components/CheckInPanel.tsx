"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "./Input";
import { Button } from "./Button";
import { checkInClient, checkOutClient } from "@/lib/actions/monitoring";
import { formatDateTime } from "@/lib/utils";
import type { CheckIn, Client } from "@/generated/prisma/client";

type CheckInPanelProps = {
  activeClients: Client[];
  activeCheckIns: (CheckIn & { client: Client })[];
};

export function CheckInPanel({
  activeClients,
  activeCheckIns,
}: CheckInPanelProps) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckIn() {
    if (!clientId) return;
    setLoading(true);
    try {
      await checkInClient(clientId);
      setClientId("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut(id: string) {
    setLoading(true);
    try {
      await checkOutClient(id);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-6">
        <h3 className="mb-4 font-semibold text-white">Quick check-in</h3>
        <div className="flex flex-wrap gap-3">
          <Select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="min-w-[200px] flex-1"
          >
            <option value="">Select active client</option>
            {activeClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleCheckIn} disabled={loading || !clientId}>
            Check in
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">
          Currently in gym ({activeCheckIns.length})
        </h3>
        {activeCheckIns.length === 0 ? (
          <p className="text-sm text-zinc-600">No one checked in right now.</p>
        ) : (
          <ul className="space-y-2">
            {activeCheckIns.map((ci) => (
              <li
                key={ci.id}
                className="flex items-center justify-between rounded-lg border border-red-600/20 bg-red-950/20 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{ci.client.name}</p>
                  <p className="text-xs text-zinc-500">
                    Since {formatDateTime(ci.checkedInAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCheckOut(ci.id)}
                  disabled={loading}
                >
                  Check out
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
