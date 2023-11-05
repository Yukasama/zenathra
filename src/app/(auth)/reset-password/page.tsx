"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { startTransition } from "react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { trpc } from "@/app/_trpc/client";

const Schema = z
  .object({
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match",
    path: ["confPassword"],
  });

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { defaultError } = useCustomToasts();

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      password: "",
      confPassword: "",
    },
  });

  const { mutate: resetPassword, isLoading } =
    trpc.user.resetPassword.useMutation({
      onError: () => defaultError(),
      onSuccess: () => {
        startTransition(() => router.push("/"));
        toast({ description: "Password updated successfully." });
      },
    });

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Change your Password here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              resetPassword({
                password: form.getValues("password"),
                token,
              })
            )}
            className="gap-3 f-col">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="bg-primary hover:bg-primary/70 mt-3"
              isLoading={isLoading}>
              <ArrowRightCircle className="h-4 w-4" />
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
