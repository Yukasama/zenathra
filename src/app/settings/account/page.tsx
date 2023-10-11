import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DeleteUserModal from "@/components/user/delete-user-modal";
import { Layers } from "lucide-react";

export default function page() {
  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
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

      <div className="f-col gap-1 mt-8">
        <h2 className="font-light text-2xl">Delete Account</h2>
        <Separator />
        <small className="text-slate-500 text-sm">
          Once you delete your account, there is no way to recover it. Please be
          sure you want to delete your account before proceeding.
        </small>
      </div>

      <DeleteUserModal />
    </div>
  );
}
