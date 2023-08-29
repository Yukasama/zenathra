"use client";

import { startTransition } from "react";
import AuthInput from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/form-wrapper";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { UserUpdateUsernameProps } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowRightCircle } from "lucide-react";
import { signOut } from "next-auth/react";

const Schema = z
  .object({
    username: z.string().min(1, "Please enter a valid name."),
    confUsername: z.string().min(1, "Please enter a valid name."),
  })
  .refine((data) => data.username === data.confUsername, {
    message: "Usernames do not match",
    path: ["confUsername"],
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
      username: "",
      confUsername: "",
    },
  });

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdateUsernameProps) => {
      const { data } = await axios.post("/api/user/update-password", payload);
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
        description: "Username could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        description: "Username updated successfully.",
      });

      signOut();
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdateUsernameProps = {
      username: data.username,
    };

    updateEmail(payload);
  }

  return (
    <FormWrapper title="Change Your Username" onSubmit={handleSubmit(onSubmit)}>
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

      <Button isLoading={isLoading}>
        <ArrowRightCircle className="h-4 w-4" />
        Change Username
      </Button>
    </FormWrapper>
  );
}
