"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { LogIn } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";
import { TRPCError } from "@trpc/server";

const Schema = z
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
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      password: "",
      confPassword: "",
    },
  });

  const { mutate: register, isLoading } = trpc.user.create.useMutation({
    onError: (err) => {
      if (err instanceof TRPCError && err.code === "CONFLICT") {
        return toast({
          title: "Oops! Something went wrong.",
          description: "E-Mail is already registered.",
          variant: "destructive",
        });
      }
      defaultError();
    },
    onSuccess: () => {
      signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => register(form.getValues()))}
        className="gap-2 f-col">
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
          name="confPassword"
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
        <Button
          color="primary"
          isLoading={isLoading}
          className="mt-3"
          type="submit">
          {!isLoading && <LogIn size={18} />}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
