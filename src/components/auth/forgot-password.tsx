"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  UserForgotPasswordProps,
  UserForgotPasswordSchema,
} from "@/lib/validators/user";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async (data: UserForgotPasswordProps) => {
      await axios.post("/api/auth/send-verification-mail", data);
      setSent(true);
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
    const payload: UserForgotPasswordProps = {
      email: data.email,
    };
    login(payload);
  }

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Forgot Your Password?</CardTitle>
        <CardDescription>Request A Reset Link Here</CardDescription>
      </CardHeader>
      <CardContent>
        {!sent ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-2 f-col">
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
              <Button
                className="bg-primary hover:bg-primary/70 mt-3"
                isLoading={isLoading}>
                <ArrowRightCircle className="h-4 w-4" />
                Reset Password
              </Button>
            </form>
          </Form>
        ) : (
          <div className="flex items-center gap-1">
            <p>Password successfully changed?</p>
            <Link
              href="/sign-in"
              className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
              Head to Login.
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="f-box gap-1">
          <p className="text-sm">Already signed up?</p>
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
            Sign In.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
