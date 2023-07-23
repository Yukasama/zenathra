"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/buttons";
import { LogIn } from "react-feather";
import { OAuth } from "@/components/routes/auth";
import AuthInput from "@/components/ui/inputs/AuthInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
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

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setLoading(false);

      if (callback?.ok) {
        toast.success("Successfully logged in.");
        router.refresh();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  return (
    <div className="flex translate-y-2 flex-col gap-3 rounded-xl border border-gray-300/60 bg-gray-200/20 p-10 pb-6 pt-5 dark:border-moon-200 dark:bg-moon-400/50 md:translate-y-0">
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Sign In To Your Account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="f-col gap-3">
        <div className="f-col gap-2">
          <AuthInput
            label="E-Mail"
            type="email"
            register={register}
            id="email"
            errors={errors}
          />
        </div>
        <div className="f-col gap-2">
          <AuthInput
            type="password"
            label="Password"
            register={register}
            id="password"
            errors={errors}
          />
        </div>
        <Link
          href="/auth/forgot-password"
          className="ml-auto cursor-pointer rounded-md p-1 px-2 text-sm text-blue-500 hover:bg-blue-500/10">
          Forgot Password?
        </Link>
        <Button
          label="Sign In"
          icon={<LogIn className="h-4" />}
          loading={loading}
        />
      </form>

      <div className="flex items-center">
        <div className="h-[1px] flex-1 bg-gray-400/60 dark:bg-moon-100"></div>
        <div className="flex-box h-10 w-10 rounded-full border border-gray-400/60 text-[12px] text-gray-400 dark:border-moon-100">
          OR
        </div>
        <div className="h-[1px] flex-1 bg-gray-400/60 dark:bg-moon-100"></div>
      </div>

      <div className="f-col gap-2">
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </div>

      <div className="flex-box mt-2 gap-1">
        <p className="text-sm">New to our platform?</p>
        <Link
          href="/auth/register"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-gray-300 dark:hover:bg-moon-200">
          Sign Up.
        </Link>
      </div>
    </div>
  );
}
