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
import { updateUsername } from "@/lib/auth/updateUser";

const Schema = z
  .object({
    username: z.string().min(1, "Please enter a valid name."),
    confUsername: z.string().min(1, "Please enter a valid name."),
  })
  .refine((data) => data.username === data.confUsername, {
    message: "Usernames do not match",
    path: ["confUsername"],
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
      username: "",
      confUsername: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const { error } = await updateUsername(data.username);
    if (!error) {
      router.push("/");
      toast.success("Username successfully changed.");
    } else {
      toast.error("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <Form title="Change Your Username">
      <form className="f-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          id="username"
          type="text"
          label="Username"
          register={register}
          errors={errors}
        />

        <AuthInput
          id="confUsername"
          type="text"
          label="Confirm Username"
          register={register}
          errors={errors}
        />

        <Button
          loading={loading}
          label="Change Username"
          color="blue"
          icon={<ArrowRightCircle className="h-4 w-4" />}
        />
      </form>
    </Form>
  );
}
