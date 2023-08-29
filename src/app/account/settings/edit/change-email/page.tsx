"use client";

import { startTransition } from "react";
import AuthInput from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/form-wrapper";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { ArrowRightCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateEmailProps } from "@/lib/validators/user";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

const Schema = z
  .object({
    email: z.string().email("Please enter a valid email."),
    confEmail: z.string(),
  })
  .refine((data) => data.email === data.confEmail, {
    message: "Emails do not match",
    path: ["confEmail"],
  });

export default function Page() {
  const router = useRouter();

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

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdateEmailProps) => {
      const { data } = await axios.post("/api/user/update-email", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Oops! Something went wrong.",
            description: "Multiple accounts linked to one mail.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Oops! Something went wrong.",
        description: "Email could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({
        description: "Email updated successfully.",
      });

      signOut();
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdateEmailProps = {
      email: data.email,
    };

    updateEmail(payload);
  }

  return (
    <FormWrapper title="Change Your E-Mail" onSubmit={handleSubmit(onSubmit)}>
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

      <Button isLoading={isLoading}>
        Change Email
        <ArrowRightCircle className="h-4 w-4" />
      </Button>
    </FormWrapper>
  );
}
