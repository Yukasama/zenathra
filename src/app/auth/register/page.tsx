"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthInput, Checkbox } from "@/components/ui/inputs";
import { Button } from "@/components/ui/buttons";
import { OAuth } from "@/components/routes/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRightCircle } from "react-feather";
import { register as signUp } from "@/lib/auth/register";
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
      await signIn("credentials", { ...data, redirect: false });
      toast.success("Signed up successfully.");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="f-col translate-y-2 gap-3 rounded-xl border border-gray-300/60 bg-gray-200/20 p-10 pb-6 pt-5 dark:border-moon-200 dark:bg-moon-400/50 md:translate-y-0">
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
          label="Keep me logged in"
          onChange={() => {}}
        />

        <Button
          loading={loading}
          label="Sign Up"
          icon={<ArrowRightCircle className="h-4 w-4" />}
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
        <p className="text-sm">Already with us?</p>
        <Link
          href="/auth/signin"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-gray-300 dark:hover:bg-moon-200">
          Sign In.
        </Link>
      </div>
    </div>
  );
}
