"use client";

import OAuth from "./oauth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { UserSignUpProps } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { startTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import axios from "axios";

const RegisterSchema = z
  .object({
    email: z.string().email("Please enter a valid email."),
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
    remember: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match",
    path: ["confPassword"],
  });

export default function AuthSignUpForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async (data: UserSignUpProps) => {
      await axios.post("/api/user/sign-up", { ...data });
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Please check your credentials and try again.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserSignUpProps = {
      email: data.email,
      password: data.password,
      remember: data.remember,
    };
    register(payload);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6">
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
                <FormDescription>
                  This is the email you used to sign up.
                </FormDescription>
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
          <FormField
            control={form.control}
            name="confpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember Me</FormLabel>
                  <FormDescription>
                    Keep me logged in on this device
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button isLoading={isLoading}>
            <LogIn className="h-4 w-4" />
            Sign Up
          </Button>
        </form>
      </Form>
      <div className="flex items-center">
        <div className="h-[1px] flex-1 bg-slate-400/60 dark:bg-zinc-100"></div>
        <div className="f-box h-10 w-10 rounded-full border border-slate-400/60 text-[12px] text-slate-400 dark:border-zinc-100">
          OR
        </div>
        <div className="h-[1px] flex-1 bg-slate-400/60 dark:bg-zinc-100"></div>
      </div>

      <div className="f-col gap-2">
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </div>
    </>
  );
}
