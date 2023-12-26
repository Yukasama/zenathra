"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CardDescription } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

export default function DeleteUserModal() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const { mutate: deleteUser, isLoading } = trpc.user.delete.useMutation({
    onError: () => toast.error("Account could not be deleted."),
    onSuccess: () => router.push("/api/auth/logout"),
  });

  function onSubmit() {
    if (title !== "CONFIRM") {
      return toast.warning("Please enter 'CONFIRM' to complete the deletion.");
    }

    deleteUser();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 self-start text-white"
          aria-label="Delete account">
          <Trash2 size={18} />
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="f-col gap-1.5">
          <Input
            placeholder="CONFIRM"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CardDescription>
            Enter &apos;CONFIRM&apos; to delete your account.
          </CardDescription>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-500"
            isLoading={isLoading}
            onClick={onSubmit}
            aria-label="Delete account">
            {!isLoading && <Trash2 size={18} />}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
