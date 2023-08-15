"use client";

import { useState } from "react";
import { AuthInput, Button, FormWrapper } from "@/components/ui";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRightCircle } from "react-feather";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "@/lib/user-update";
import { signOut } from "next-auth/react";

const Schema = z
  .object({
    oldPassword: z.string().min(1, "Please enter a valid password."),
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match",
    path: ["confPassword"],
  });

export default function ChangePassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const { error } = await updatePassword(data.oldPassword, data.password);
    if (!error) {
      setLoading(false);
      toast.success("Password successfully reset.");

      signOut({ redirect: true, callbackUrl: "/auth/sign-in" });
      router.refresh();
    } else toast.error("Something went wrong. Please try again later.");
  };

  return (
    <FormWrapper title="Change Your Password" onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        id="oldPassword"
        type="password"
        label="Old Password"
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

      <Button
        loading={loading}
        label="Change Password"
        color="blue"
        icon={<ArrowRightCircle className="h-4 w-4" />}
      />
    </FormWrapper>
  );
}
