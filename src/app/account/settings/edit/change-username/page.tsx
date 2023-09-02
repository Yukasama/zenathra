"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { UserUpdateUsernameProps } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowRightCircle } from "lucide-react";
import { signOut } from "next-auth/react";
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
    username: z.string().min(1, "Please enter a valid name."),
    confUsername: z.string().min(1, "Please enter a valid name."),
  })
  .refine((data) => data.username === data.confUsername, {
    message: "Usernames do not match",
    path: ["confUsername"],
  });

export default function Page() {
  const router = useRouter();

  const form = useForm<FieldValues>({
    resolver: zodResolver(Schema),
  });

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdateUsernameProps) => {
      const { data } = await axios.post("/api/user/update-password", payload);
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
        description: "Username could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        description: "Username updated successfully.",
      });

      signOut();
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdateUsernameProps = {
      username: data.username,
    };

    updateEmail(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 f-col">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Username</FormLabel>
              <FormControl>
                <Input placeholder="Confirm your Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" variant="subtle" isLoading={isLoading}>
          <ArrowRightCircle className="h-4" />
          Change Username
        </Button>
      </form>
    </Form>
  );
}
