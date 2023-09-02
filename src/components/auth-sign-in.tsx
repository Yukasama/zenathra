"use client";

import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "./ui/button";
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
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export default function AuthSignIn() {
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
    <Card className="w-[400px] z-10 f-col border-none rounded-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 f-col">
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
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none mt-5">
                    <FormLabel>Remember Me</FormLabel>
                    <FormDescription className="text-[13px]">
                      Keep me logged in
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Link
              href="/auth/forgot-password"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-[13px]"
              )}>
              Forgot Password?
            </Link>
          </div>

          <Button className="mt-4" variant="subtle" isLoading={isLoading}>
            <LogIn className="h-4" />
            Sign In
          </Button>
        </form>
      </Form>
      <div className="flex items-center my-3">
        <div className="flex-1 border"></div>
        <div className="f-box h-10 w-10 rounded-full border text-[12px] text-slate-400 ">
          OR
        </div>
        <div className="flex-1 border"></div>
      </div>

      <div className="f-col gap-2">
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </div>
    </Card>
  );
}
