"use client";

import { SignInResponse, signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import OAuth from "../oauth";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { z } from "zod";

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
      if (response?.error) throw new Error(response?.error);
      return response as SignInResponse;
    },
    onError: (err: string) =>
      toast({
        title: "We have trouble signing you in.",
        description: `${err ?? "Please try again later."}`,
        variant: "destructive",
      }),
    onSettled: (res, resp) => {
      if (!resp) window.location.reload();
    },
  });

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Login To Your Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => login(form.getValues()))}
            className="gap-3 f-col">
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
