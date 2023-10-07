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
import { UserUpdateProps, UserUpdateSchema } from "@/lib/validators/user";

export default function ChangeUsername() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      given_name: "",
      family_name: "",
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
    const payload: UserUpdateProps = {
      givenName: data.given_name,
      familyName: data.family_name,
    };

    updateUsername(payload);
  }

  return (
    <div className="f-col gap-5">
      <div className="f-col gap-0.5">
        <h2 className="font-medium text-lg">Change Username</h2>
        <p className="text-sm text-slate-400">
          You can change your Username here
        </p>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 f-col">
            <FormField
              control={form.control}
              name="given_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="family_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button className="mt-4" variant="subtle" isLoading={isLoading}>
              <ArrowRightCircle className="h-4 w-4" />
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
