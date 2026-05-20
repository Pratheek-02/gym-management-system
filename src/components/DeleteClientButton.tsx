"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "./Button";
import { deleteClient } from "@/lib/actions/clients";

type DeleteClientButtonProps = {
  clientId: string;
  clientName: string;
  compact?: boolean;
};

export function DeleteClientButton({
  clientId,
  clientName,
  compact = false,
}: DeleteClientButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm(
      `Delete "${clientName}"?\n\nThis permanently removes all fees, payments, check-ins, and notes for this client. This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteClient(clientId);
      router.push("/clients");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        title={`Delete ${clientName}`}
        aria-label={`Delete ${clientName}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {loading ? "Deleting…" : "Delete client"}
    </Button>
  );
}
