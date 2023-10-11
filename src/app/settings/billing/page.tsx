import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const user = getUser()!;

  const dbUser = await db.user.findFirst({
    select: { biography: true },
    where: { id: user.id ?? undefined },
  });

  if (!dbUser) return redirect("/");

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Billing Information</h2>
        <Separator />
      </div>
    </div>
  );
}
