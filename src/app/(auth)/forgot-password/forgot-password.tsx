"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { Button } from "@nextui-org/react";

const Schema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { email: "" },
  });

  const { mutate: sendMail, isLoading } =
    trpc.user.sendResetPassword.useMutation({
      onError: () => {
        toast({
          title: "Oops! Something went wrong.",
          description: "E-Mail could not be sent.",
          variant: "destructive",
        });
      },
      onSuccess: () => setSent(true),
    });

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
              onSubmit={form.handleSubmit(() =>
                sendMail(form.getValues().email)
              )}
              className="gap-3 f-col">
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
              <Button
                color="primary"
                isLoading={isLoading}
                className="mt-2"
                type="submit">
                {!isLoading && <ArrowRightCircle size={18} />}
                Reset Password
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-1 text-sm">
          {!sent ? "Already signed up?" : "Password successfully changed?"}
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900">
            {!sent ? "Sign In." : "Head to Login."}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
