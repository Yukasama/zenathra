import { PLANS } from "@/config/stripe";
import { Chip } from "@nextui-org/chip";
import PricingCard from "./pricing-card";

export const metadata = { title: "Pricing" };
// export const runtime = "edge";

export default function page() {
  return (
    <div className="f-col justify-center items-center pt-16 pb-7 gap-5">
      {/* Header */}
      <Chip className="bg-primary/20 border border-primary/50" size="lg">
        Pricing
      </Chip>
      <h1 className="text-4xl font-bold font-['Helvetica'] max-w-[400px] text-center">
        Choose the plan that fits your needs
      </h1>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
