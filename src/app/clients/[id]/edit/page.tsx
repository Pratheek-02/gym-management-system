import { notFound } from "next/navigation";
import { getClient, getMembershipPlans } from "@/lib/actions/clients";
import { ClientForm } from "@/components/ClientForm";
import { PageHeader } from "@/components/PageHeader";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, plans] = await Promise.all([
    getClient(id),
    getMembershipPlans(),
  ]);

  if (!client) notFound();

  return (
    <div>
      <PageHeader title="Edit client" description={client.name} />
      <ClientForm plans={plans} client={client} />
    </div>
  );
}
