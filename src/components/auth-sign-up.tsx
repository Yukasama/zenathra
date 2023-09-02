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
import { Card } from "./ui/card";

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

export default function AuthSignUp() {
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
          <FormField
            control={form.control}
            name="confpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
          <Button variant="subtle" isLoading={isLoading}>
            <LogIn className="h-4" />
            Sign Up
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
