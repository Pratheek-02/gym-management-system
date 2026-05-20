"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, X, User } from "lucide-react";
import { searchClients } from "@/lib/actions/clients";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { useGym } from "./GymProvider";
import { formatCurrency } from "@/lib/utils";

export function ClientSearch() {
  const { currency } = useGym();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof searchClients>>
  >([]);
  const [pending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchClients(value);
      setResults(found);
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        className="border-red-900/50 bg-red-950/30 hover:bg-red-950/60"
      >
        <Search className="mr-2 h-4 w-4 text-red-400" />
        Search clients
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-red-900/40 bg-[#0a0a0a] shadow-2xl shadow-red-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-3">
              <Search className="h-5 w-5 text-red-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, phone, or email…"
                className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {pending && (
                <p className="px-3 py-6 text-center text-sm text-zinc-500">
                  Searching…
                </p>
              )}
              {!pending && query && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-zinc-500">
                  No clients found for &quot;{query}&quot;
                </p>
              )}
              {!pending && !query && (
                <p className="px-3 py-6 text-center text-sm text-zinc-500">
                  Type to search members
                </p>
              )}
              {results.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-red-950/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-xs text-zinc-500">
                      {client.phone}
                      {client.email ? ` · ${client.email}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400">
                      {formatCurrency(client.monthlyFee, currency)}
                    </p>
                    <StatusBadge status={client.status} />
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t border-[#2a2a2a] px-4 py-3">
              <Link
                href={`/clients${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                onClick={() => setOpen(false)}
                className="text-sm text-red-400 hover:underline"
              >
                View all clients →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
