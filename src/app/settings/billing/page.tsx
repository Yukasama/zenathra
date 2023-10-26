import { Separator } from "@/components/ui/separator";

export const runtime = "edge";

export default async function page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Billing Information</h2>
        <Separator />
      </div>
    </div>
  );
}
