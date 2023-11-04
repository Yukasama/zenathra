"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UserMailProps, UserMailSchema } from "@/lib/validators/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/app/_trpc/client";

export default function Page() {
  const [sent, setSent] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(UserMailSchema),
    defaultValues: { email: "" },
  });

  const { mutate: sendMail, isLoading } = trpc.user.sendResetPassword.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: "E-Mail could not be sent.",
        variant: "destructive",
      });
    },
    onSuccess: () => setSent(true),
  });

  function onSubmit(data: FieldValues) {
    const payload: UserMailProps = { email: data.email };
    sendMail(payload);
  }

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        {!sent && <CardTitle>Forgot Your Password?</CardTitle>}
        <CardDescription className={`${sent && "text-green-500 text-md"}`}>
          {!sent
            ? "Request a reset link here"
            : "Reset E-Mail successfully sent."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sent && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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
              <Button
                className="bg-primary hover:bg-primary/70 mt-3"
                isLoading={isLoading}>
                <ArrowRightCircle className="h-4 w-4" />
                Reset Password
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1 text-sm">
          <p>
            {!sent ? "Already signed up?" : "Password successfully changed?"}
          </p>
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-primary hover:bg-slate-100 dark:hover:bg-slate-900">
            {!sent ? "Sign In." : "Head to Login."}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
