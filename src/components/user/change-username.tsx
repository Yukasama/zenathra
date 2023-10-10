"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { ArrowRightCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";
import { UserUpdateSchema } from "@/lib/validators/user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props {
  user: Pick<KindeUser, "given_name" | "family_name">;
}

export default function ChangeUsername({ user }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      givenName: user.given_name ?? "",
      familyName: user.family_name ?? "",
    },
  });

  const { mutate: updateUsername, isLoading } = trpc.user.update.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: "Name could not be updated.",
        variant: "destructive",
      }),
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({ description: "Name updated successfully." });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload = {
      givenName: data.givenName,
      familyName: data.familyName,
    };

    updateUsername(payload);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="f-col items-start gap-1">
          <h2>Username</h2>
          <div className="bg-white w-full dark:bg-gray-950 flex items-center h-12 rounded-md border p-4 gap-1">
            <p>{`${user?.given_name} ${user?.family_name}`}</p>
          </div>
          <small className="text-slate-500 text-sm">
            This name combination will appear on your public profile.
          </small>
        </div>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle className="font-medium text-lg">
            Change Username
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-400">
            You can change your first and last name here
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-3 f-col">
            <FormField
              control={form.control}
              name="givenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button className="mt-2" variant="subtle" isLoading={isLoading}>
              Save changes
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
