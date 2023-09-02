"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

const Schema = z
  .object({
    oldPassword: z.string().min(1, "Please enter a valid password."),
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

  const form = useForm<FieldValues>({
    resolver: zodResolver(Schema),
  });

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdatePasswordProps) => {
      const { data } = await axios.post("/api/user/update-password", payload);
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
      oldPassword: data.oldPassword,
      password: data.password,
    };

    updateEmail(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 f-col">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your old Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm your new Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" variant="subtle" isLoading={isLoading}>
          <ArrowRightCircle className="h-4" />
          Change Password
        </Button>
      </form>
    </Form>
  );
}
