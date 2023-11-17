"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../../../../components/ui/button";
import { startTransition, useState } from "react";
import { toast } from "@/hooks/use-toast";
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
import { Input } from "../../../../components/ui/input";
import { CardDescription } from "../../../../components/ui/card";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";

export default function DeleteUserModal() {
  const router = useRouter();

  const [title, setTitle] = useState<string>();

  const { mutate: deleteUser, isLoading } = trpc.user.delete.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: "Account could not be deleted.",
        variant: "destructive",
      }),
    onSuccess: async () => {
      startTransition(() => router.refresh());

      await fetch("/api/auth/logout");
    },
  });

  function onSubmit() {
    if (title !== "CONFIRM")
      return toast({
        title: "Oops! Something went wrong.",
        description: "Please enter CONFIRM to complete the deletion.",
        variant: "destructive",
      });

    deleteUser();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: "destructive" }),
            "self-start"
          )}>
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
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
            variant="destructive"
            isLoading={isLoading}
            onClick={onSubmit}>
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
