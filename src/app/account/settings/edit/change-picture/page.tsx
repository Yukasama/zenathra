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
import Form from "@/components/ui/Form";

const Schema = z
  .object({
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
      password: "",
      confPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <Form title="Change Your Picture" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-40 text-center text-3xl font-thin">Coming soon...</div>
    </Form>
  );
}
