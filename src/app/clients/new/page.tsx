import { getMembershipPlans } from "@/lib/actions/clients";
import { ClientForm } from "@/components/ClientForm";
import { PageHeader } from "@/components/PageHeader";

export default async function NewClientPage() {
  const plans = await getMembershipPlans();

  return (
    <div>
      <PageHeader
        title="Add client"
        description="Register a new gym member"
      />
      <ClientForm plans={plans} />
    </div>
  );
}
