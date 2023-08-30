"use client";

import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import OAuth from "./oauth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { UserSignInProps, UserSignInSchema } from "@/lib/validators/user";
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

export default function AuthSignInForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserSignInSchema),
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: (data: UserSignInProps) => signIn("credentials", { ...data }),
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
    const payload: UserSignInProps = {
      email: data.email,
      password: data.password,
    };
    login(payload);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 f-col">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem>
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
          <Link
            href="/auth/forgot-password"
            className="ml-auto rounded-md p-1 px-2 text-sm text-blue-500 hover:bg-blue-500/10">
            Forgot Password?
          </Link>
          <Button isLoading={isLoading}>
            <LogIn className="h-4" />
            Sign In
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
