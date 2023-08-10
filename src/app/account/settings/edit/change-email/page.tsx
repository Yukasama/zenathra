"use client";

import { useState } from "react";
import { Button } from "@/components/ui/buttons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRightCircle } from "react-feather";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthInput } from "@/components/ui/inputs";
import { updateEmail } from "@/lib/auth/updateUser";
import Form from "@/components/ui/Form";
import { signOut } from "next-auth/react";

const Schema = z
  .object({
    email: z.string().email("Please enter a valid email."),
    confEmail: z.string(),
  })
  .refine((data) => data.email === data.confEmail, {
    message: "Emails do not match",
    path: ["confEmail"],
  });

export default function ChangeEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      confEmail: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const { error } = await updateEmail(data.email);
    if (!error) {
      setLoading(false);
      toast.success("Email successfully reset.");

      router.refresh();
      signOut({ redirect: true, callbackUrl: "/auth/signin" });
    } else {
      toast.error(error || "An error occurred during email reset.");
    }
  };

  return (
    <Form title="Change Your E-Mail" onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        id="email"
        type="email"
        label="E-Mail"
        register={register}
        errors={errors}
      />

      <AuthInput
        id="confEmail"
        type="confEmail"
        label="Confirm E-Mail"
        register={register}
        errors={errors}
      />

      <Button
        loading={loading}
        label="Change Email"
        color="blue"
        icon={<ArrowRightCircle className="h-4 w-4" />}
      />
    </Form>
  );
}
