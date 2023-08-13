"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthInput, Button, Checkbox } from "@/components/ui";
import { OAuth } from "@/components";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRightCircle } from "react-feather";
import { signUp } from "@/lib/user-update";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

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

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const { error } = await signUp(data.email, data.password);

    if (error) toast.error(error || "An error occurred during signup.");
    else {
      await signIn("credentials", { ...data, redirect: true }).then(
        (callback) => {
          setLoading(false);

          if (callback?.ok) router.refresh();
          if (callback?.error) toast.error(callback.error);
        }
      );
    }
  };

  return (
    <>
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Create Your Account
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="f-col gap-3">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          register={register}
          errors={errors}
        />
        <AuthInput
          id="password"
          type="password"
          label="Password"
          register={register}
          errors={errors}
        />
        <AuthInput
          id="confPassword"
          type="password"
          label="Confirm Password"
          register={register}
          errors={errors}
        />

        <Checkbox
          className="ml-1.5"
          heading="Remember Me"
          label="Keep me logged in on this device."
          onChange={() => {}}
        />

        <Button
          loading={loading}
          label="Sign Up"
          icon={<ArrowRightCircle className="h-4 w-4" />}
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

      <div className="f-box mt-2 gap-1">
        <p className="text-sm">Already with us?</p>
        <Link
          href="/auth/signin"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-moon-200">
          Sign In.
        </Link>
      </div>
    </>
  );
}
