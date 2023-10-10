import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { getUser } from "@/lib/auth";
import dynamic from "next/dynamic";

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

export default function page() {
  const user = getUser();

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Profile</h2>
        <Separator />
      </div>

      <ChangeUsername user={user!} />
    </div>
  );
}
