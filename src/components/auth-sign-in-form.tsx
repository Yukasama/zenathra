"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthInput, Button, Checkbox } from "@/components/ui";
import { OAuth } from "@/components";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
});

export default function AuthSignInForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);

    signIn("credentials", { ...data, redirect: true }).then((callback) => {
      setLoading(false);

      if (callback?.ok) router.refresh();
      if (callback?.error)
        toast({
          title: "Oops! Something went wrong.",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="f-col gap-3">
        <AuthInput
          label="E-Mail"
          type="email"
          register={register}
          id="email"
          errors={errors}
        />
        <AuthInput
          type="password"
          label="Password"
          register={register}
          id="password"
          errors={errors}
        />
        <Checkbox
          className="ml-1.5"
          heading="Remember Me"
          label="Keep me logged in on this device."
          onChange={() => {}}
        />
        <Link
          href="/auth/forgot-password"
          className="ml-auto rounded-md p-1 px-2 text-sm text-blue-500 hover:bg-blue-500/10">
          Forgot Password?
        </Link>
        <Button
          label="Sign In"
          icon={<LogIn className="h-4" />}
          loading={loading}
        />
      </form>

      <div className="flex items-center">
        <div className="h-[1px] flex-1 bg-slate-400/60 dark:bg-moon-100"></div>
        <div className="f-box h-10 w-10 rounded-full border border-slate-400/60 text-[12px] text-slate-400 dark:border-moon-100">
          OR
        </div>
        <div className="h-[1px] flex-1 bg-slate-400/60 dark:bg-moon-100"></div>
      </div>

      <div className="f-col gap-2">
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </div>
    </>
  );
}
