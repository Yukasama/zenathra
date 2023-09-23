"use client";

import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "../ui/button";
import OAuth from "./oauth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { SignInProps, SignInSchema } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { startTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

export default function SignIn() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (data: SignInProps) => {
      const y = await signIn("credentials", { ...data, redirect: false });
      console.log(y);
      return y;
    },
    onError: (err: any) =>
      toast({
        title: "Oops! Something went wrong.",
        description: `${err?.error ?? "Unknown Error"}`,
        variant: "destructive",
      }),
    onSuccess: () => startTransition(() => router.refresh()),
  });

  function onSubmit(data: FieldValues) {
    const payload: SignInProps = {
      email: data.email,
      password: data.password,
    };
    login(payload);
  }

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Login To Your Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-3 f-col">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    E-Mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your E-Mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-[13px] ml-auto"
              )}>
              Forgot Password?
            </Link>

            <Button
              className="bg-primary hover:bg-primary/70 mt-1"
              isLoading={isLoading}>
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </form>
        </Form>
        <div className="flex items-center my-3">
          <div className="flex-1 border"></div>
          <div className="f-box h-10 w-10 rounded-full border text-[12px] text-slate-400">
            OR
          </div>
          <div className="flex-1 border"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="f-box gap-1 text-sm">
          <p>New to our platform?</p>
          <Link
            href="/sign-up"
            className="rounded-md p-1 px-1.5 font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
            Sign Up.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
