"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";

  const form = useForm<FieldValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      password: "",
      confPassword: "",
    },
  });

  const { mutate: updatePassword, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdatePasswordProps) => {
      const { data } = await axios.post("/api/user/reset-password", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Incorrect Password provided.",
            description: "Please enter the correct one or reset your password.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Oops! Something went wrong.",
        description: "Password could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        description: "Password updated successfully.",
      });
      signOut();
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 f-col">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new Password" {...field} />
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
                    <Input placeholder="Confirm your new Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" variant="subtle" isLoading={isLoading}>
              <ArrowRightCircle className="h-4 w-4" />
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
