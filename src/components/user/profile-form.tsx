"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { HardDrive } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";
import { UserUpdateSchema } from "@/lib/validators/user";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { User } from "@prisma/client";
import { Textarea } from "../ui/textarea";

interface Props {
  user: Pick<KindeUser, "given_name" | "family_name">;
  dbUser: Pick<User, "biography">;
}

export default function ProfileForm({ user, dbUser }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      givenName: user.given_name ?? "",
      familyName: user.family_name ?? "",
      biography: dbUser.biography ?? "",
    },
  });

  const { mutate: updateUsername, isLoading } = trpc.user.update.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: "Profile could not be updated.",
        variant: "destructive",
      }),
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({ description: "Profile updated successfully." });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload = {
      givenName: data.givenName,
      familyName: data.familyName,
      biography: data.biography,
    };

    updateUsername(payload);
  }

  return (
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
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black dark:text-white">
                Biography
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your biography..."
                  {...field}
                  maxLength={500}
                  required
                />
              </FormControl>
              <FormDescription>(Max. 500 characters)</FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button className="self-start" variant="subtle" isLoading={isLoading}>
          <HardDrive className="h-4 w-4" />
          Save
        </Button>
      </form>
    </Form>
  );
}
