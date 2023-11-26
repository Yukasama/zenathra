import { Separator } from "@/components/ui/separator";
import { Layers } from "lucide-react";
import dynamic from "next/dynamic";
import { SkeletonButton } from "@/components/ui/skeleton";
import { Button } from "@nextui-org/button";

export const metadata = { title: "Account Settings" };

const DeleteUserModal = dynamic(
  () => import("@/app/(user)/settings/account/delete-user-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton />,
  }
);

export default function page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Export Data</h2>
        <Separator />
        <small className="text-zinc-500 text-sm">
          Export all portfolio, stock and profile data we have stored in our
          database (Coming soon)
        </small>
      </div>

      <Button color="primary" className="self-start">
        <Layers size={18} />
        Export Data
      </Button>

      <div className="f-col gap-1 mt-8">
        <h2 className="font-light text-2xl">Delete Account</h2>
        <Separator />
        <small className="text-zinc-500 text-sm">
          Once you delete your account, there is no way to recover it. Please be
          sure you want to delete your account before proceeding.
        </small>
      </div>

      <DeleteUserModal />
    </div>
  );
}
