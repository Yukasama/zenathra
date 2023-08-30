"use client";

import { useState } from "react";
import Link from "next/link";
import AuthInput from "./ui/auth-input";
import { Button } from "./ui/button";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightCircle } from "lucide-react";

const Schema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function AuthForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <>
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="f-col gap-2.5">
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            register={register}
            errors={errors}
          />

          <Button isLoading={loading}>
            <ArrowRightCircle className="h-4 w-4" />
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-1">
          <p>Password successfully changed?</p>
          <Link
            href="/auth/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-zinc-200">
            Head to Login.
          </Link>
        </div>
      )}
    </>
  );
}
