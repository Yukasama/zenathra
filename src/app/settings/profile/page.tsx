import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { Layers } from "lucide-react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ChangeUsername = dynamic(
  () => import("@/components/user/change-username"),
  {
    ssr: false,
    loading: () => (
      <div className="f-col gap-1 w-full">
        <Skeleton className="h-5" />
        <Skeleton className="h-12 w-full" />
      </div>
    ),
  }
);

export default async function page() {
  const user = getUser()!;

  const dbUser = await db.user.findFirst({
    select: {
      biography: true,
    },
    where: { id: user.id ?? undefined },
  });

  if (!dbUser) return redirect("/");

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Profile</h2>
        <Separator />
      </div>

      <ChangeUsername user={user} />

      <div className="f-col gap-1">
        <h2>Biography</h2>
        <Textarea className="bg-white w-full dark:bg-gray-950" maxLength={500}>
          {dbUser.biography}
        </Textarea>
        <small className="text-slate-500 text-sm">
          This biography will appear on your public profile. (500 characters)
        </small>
      </div>

      <div className="f-col gap-1 mt-8">
        <h2 className="font-light text-2xl">Export Data</h2>
        <Separator />
        <small className="text-slate-500 text-sm">
          Export all portfolio, stock and profile data we have stored in our
          database
        </small>
      </div>

      <Button className="bg-primary self-start hover:bg-primary/80">
        <Layers className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
}
