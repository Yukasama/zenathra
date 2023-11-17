import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/config/stripe";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { CheckCircle } from "lucide-react";

export const metadata = { title: "Pricing" };
export const runtime = "edge";

export default function page() {
  return (
    <div className="f-col justify-center items-center pt-20 gap-5">
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
          <Card
            key={plan.name}
            className="min-w-[400px] f-col justify-between gap-8 bg-zinc-900/50">
            <CardHeader className="f-col gap-7">
              <div className="f-col gap-1">
                <Chip
                  className="bg-zinc-950/70 border border-zinc-800 mb-2"
                  size="lg">
                  {plan.name}
                </Chip>
                <CardTitle className="text-3xl">
                  {!plan.price.amount ? (
                    "Free"
                  ) : (
                    <div className="flex gap-2 items-end">
                      <p>${plan.price.amount}</p>
                      <span className="text-zinc-500 text-lg font-normal">
                        Per Month
                      </span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <div className="f-col gap-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardFooter>
              <Button variant="bordered" size="lg" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
