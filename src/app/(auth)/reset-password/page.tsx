"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UserUpdatePasswordProps } from "@/lib/validators/user";
import axios, { AxiosError } from "axios";
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

  const form = useForm<FieldValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      password: "",
      confPassword: "",
    },
  });

  const { mutate: updatePassword, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdatePasswordProps) =>
      await axios.post("/api/user/reset-password", payload),
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 401)
        return toast({
          title: "Unauthorized.",
          description: "You are not authorized to pursue this action.",
          variant: "destructive",
        });
      toast({
        title: "Oops! Something went wrong.",
        description: "Password could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.push("/"));
      toast({ description: "Password updated successfully." });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdatePasswordProps = {
      password: data.password,
      token,
    };
    updatePassword(payload);
  }

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Change your Password here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-3 f-col">
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
