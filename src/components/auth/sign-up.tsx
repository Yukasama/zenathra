"use client";

import OAuth from "./oauth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { SignInProps } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

const RegisterSchema = z
  .object({
    email: z.string().email("Please enter a valid email."),
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match",
    path: ["confPassword"],
  });

export default function SignUp() {
  const { defaultError } = useCustomToasts();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confPassword: "",
    },
  });

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async (data: SignInProps) =>
      await axios.post("/api/user/sign-up", { ...data }),
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 409)
        return toast({
          title: "Oops! Something went wrong.",
          description: "E-Mail is already registered.",
          variant: "destructive",
        });
      defaultError();
    },
    onSuccess: () => {
      signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
      });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: SignInProps = {
      email: data.email,
      password: data.password,
    };
    register(payload);
  }

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your Personal Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-2 f-col">
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
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              className="bg-primary hover:bg-primary/70 mt-3"
              isLoading={isLoading}>
              <LogIn className="h-4 w-4" />
              Sign Up
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
