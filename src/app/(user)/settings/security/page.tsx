import { Separator } from "@/components/ui/separator";
import { SITE } from "@/config/site";

export const metadata = {
  title: `${SITE.name} | Security Settings`,
};

export default async function page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Security</h2>
        <Separator />
      </div>
    </div>
  );
}
