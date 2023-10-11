import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ProfileForm = dynamic(() => import("@/components/user/profile-form"), {
  ssr: false,
  loading: () => (
    <div className="f-col gap-3 w-full">
      {[...Array(4)].map((_, i) => (
        <>
          <Skeleton key={i} className="h-5" />
          <Skeleton className="h-12 w-full" />
        </>
      ))}
    </div>
  ),
});

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
        <h2 className="font-light text-2xl">Profile</h2>
        <Separator />
        <small className="text-sm text-slate-500">
          These changes will appear on your public profile.
        </small>
      </div>

      <ProfileForm user={user} dbUser={dbUser} />
    </div>
  );
}
