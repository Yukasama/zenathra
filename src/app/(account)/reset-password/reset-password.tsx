"use client";

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
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { trpc } from "@/trpc/client";
import { Button } from "@nextui-org/button";

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

export default function ResetPassword() {
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
        toast({ description: "Password updated successfully." });
        router.push("/");
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              color="primary"
              isLoading={isLoading}
              className="mt-2"
              type="submit">
              {!isLoading && <ArrowRightCircle size={18} />}
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
