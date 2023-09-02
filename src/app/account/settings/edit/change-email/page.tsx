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
import { UserUpdateEmailProps } from "@/lib/validators/user";
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
    email: z.string().email("Please enter a valid email."),
    confEmail: z.string(),
  })
  .refine((data) => data.email === data.confEmail, {
    message: "Emails do not match",
    path: ["confEmail"],
  });

export default function Page() {
  const router = useRouter();

  const form = useForm<FieldValues>({
    resolver: zodResolver(Schema),
  });

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdateEmailProps) => {
      const { data } = await axios.post("/api/user/update-email", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Oops! Something went wrong.",
            description: "Multiple accounts linked to one mail.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Oops! Something went wrong.",
        description: "Email could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({
        description: "Email updated successfully.",
      });

      signOut();
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdateEmailProps = {
      email: data.email,
    };

    updateEmail(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 f-col">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="Enter your E-Mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="Confirm your E-Mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" variant="subtle" isLoading={isLoading}>
          <ArrowRightCircle className="h-4" />
          Change E-Mail
        </Button>
      </form>
    </Form>
  );
}
