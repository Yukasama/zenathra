"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { ArrowRightCircle } from "react-feather";
import AuthInput from "@/components/ui/inputs/AuthInput";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { sendMail } from "@/lib/auth/sendMail";

const Schema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function ForgotPassword() {
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

    const { error } = await sendMail(
      data.email,
      "Reset Password",
      "This mail resets your password"
    );
    if (!error) {
      toast.success("Password reset email sent.");
      setSent(true);
    } else {
      toast.error(
        "Could not send password reset email. Please try again later." + error
      );
    }
    setLoading(false);
  };

  return (
    <div className="f-col translate-y-2 gap-3 rounded-xl border border-moon-200 bg-moon-400/50 p-10 pb-6 pt-5 md:translate-y-0">
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Forgot Your Password?
      </h2>
      {!sent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="f-col gap-2.5">
          <AuthInput
            id="email"
            type="email"
            label="E-Mail"
            register={register}
            errors={errors}
          />

          <Button
            disabled={loading}
            label="Reset Password"
            color="blue"
            icon={<ArrowRightCircle className="h-4 w-4" />}
          />
        </form>
      ) : (
        <div className="flex items-center gap-1">
          <p>Password successfully changed?</p>
          <Link
            href="/auth/signin"
            className="rounded-md p-1 px-1.5 font-medium text-blue-500 hover:bg-gray-300 dark:hover:bg-moon-200">
            Head to Login.
          </Link>
        </div>
      )}
    </div>
  );
}
