"use client";

import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@nextui-org/button";

const Schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
});

export default function SignIn() {
  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (data: FieldValues) => {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response?.error);
      }

      return response;
    },
    onError: (err) => {
      toast({
        title: "We have trouble signing you in.",
        description: `${err ?? "Please try again later."}`,
        variant: "destructive",
      });
    },
    onSettled: (response) => {
      if (response?.url) {
        window.location.reload();
      }
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => login(form.getValues()))}
        className="gap-3 f-col">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your E-Mail"
                  {...field}
                />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link href="/forgot-password" className="text-[13px] ml-auto">
          Forgot Password?
        </Link>

        <Button
          color="primary"
          isLoading={isLoading}
          className="mt-0.5"
          type="submit">
          {!isLoading && <LogIn size={18} />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
