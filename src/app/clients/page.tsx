import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getClients } from "@/lib/actions/clients";
import { getGymSettings } from "@/lib/actions/settings";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
  const [settings, allClients] = await Promise.all([
    getGymSettings(),
    getClients(status),
  ]);

  let clients = allClients;
  if (params.q) {
    const q = params.q.toLowerCase();
    clients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }

  const tabs = [
    { label: "All", href: "/clients" },
    { label: "Active", href: "/clients?status=ACTIVE" },
    { label: "Inactive", href: "/clients?status=INACTIVE" },
    { label: "Suspended", href: "/clients?status=SUSPENDED" },
  ];

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage members, membership plans, and contact details"
        action={
          <Link href="/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add client
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-[#2a2a2a] bg-[#111] p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                (!status && tab.href === "/clients") ||
                (status && tab.href.includes(status))
                  ? "theme-tab-active"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form className="flex flex-1 min-w-[240px] max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500/70" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search name, phone, email…"
              className="theme-input py-2 pl-10"
            />
          </div>
          <Button type="submit" variant="secondary">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </div>

      {params.q && (
        <p className="mb-4 text-sm text-zinc-500">
          Showing {clients.length} result{clients.length !== 1 ? "s" : ""} for
          &quot;{params.q}&quot;
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-left text-sm">
          <thead className="theme-table-head">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Monthly fee</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="bg-[#0a0a0a]/50 transition-colors hover:bg-red-950/20"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/clients/${client.id}`}
                    className="font-medium text-white hover:text-red-400"
                  >
                    {client.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-zinc-400">{client.phone}</td>
                <td className="px-5 py-3 text-zinc-400">
                  {client.membershipPlan?.name ?? "Custom"}
                </td>
                <td className="px-5 py-3">
                  {formatCurrency(client.monthlyFee, settings.currency)}
                </td>
                <td className="px-5 py-3 text-zinc-500">
                  {formatDate(client.joinDate)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <DeleteClientButton
                    clientId={client.id}
                    clientName={client.name}
                    compact
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="py-12 text-center text-zinc-500">No clients found</p>
        )}
      </div>
    </div>
  );
}
