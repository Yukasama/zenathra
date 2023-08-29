"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthInput, Button } from "@/components/ui";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { sendVerificationMail } from "@/lib/user-send-verification";
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

    const { error } = await sendVerificationMail(
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
            href="/auth/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-moon-200">
            Head to Login.
          </Link>
        </div>
      )}
    </>
  );
}
