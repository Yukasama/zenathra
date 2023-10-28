import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Layers } from "lucide-react";
import dynamic from "next/dynamic";

const DeleteUserModal = dynamic(
  () => import("@/app/settings/account/delete-user-modal"),
  {
    ssr: false,
    loading: () => (
      <Button variant="destructive" className="self-start" isLoading />
    ),
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
          database (Functionality coming soon)
        </small>
      </div>

      <Button className="bg-primary self-start hover:bg-primary/80">
        <Layers className="h-4 w-4" />
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
