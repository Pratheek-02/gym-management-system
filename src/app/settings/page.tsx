import { getGymSettings } from "@/lib/actions/settings";
import { getMembershipPlans } from "@/lib/actions/clients";
import { PageHeader } from "@/components/PageHeader";
import { SettingsForm } from "@/components/SettingsForm";
import { PlanManager } from "@/components/PlanManager";

export default async function SettingsPage() {
  const [settings, plans] = await Promise.all([
    getGymSettings(),
    getMembershipPlans(),
  ]);

  return (
    <div>
      <PageHeader
        title="Customize your gym"
        description="Set your gym name, contact details, currency, fee rules, and membership plans"
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Gym profile</h2>
          <SettingsForm settings={settings} />
        </section>
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Membership plans
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            Define plans your gym offers. New clients can pick these when registering.
          </p>
          <PlanManager plans={plans} />
        </section>
      </div>
    </div>
  );
}
