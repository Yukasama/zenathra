"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/ui/form-wrapper";
import { ArrowRightCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UserUpdatePasswordProps } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { startTransition } from "react";

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

export default function Page() {
  const router = useRouter();

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

  const { mutate: updateEmail, isLoading } = useMutation({
    mutationFn: async (payload: UserUpdatePasswordProps) => {
      const { data } = await axios.post("/api/user/update-password", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Incorrect Password provided.",
            description: "Please enter the correct one or reset your password.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Oops! Something went wrong.",
        description: "Password could not be updated.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        description: "Password updated successfully.",
      });

      signOut();
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UserUpdatePasswordProps = {
      oldPassword: data.oldPassword,
      password: data.password,
    };

    updateEmail(payload);
  }

  return (
    <FormWrapper title="Change Your Picture" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-40 text-center text-3xl font-thin">Coming soon...</div>
      <Button isLoading={isLoading}>
        Change Picture
        <ArrowRightCircle className="h-4 w-4" />
      </Button>
    </FormWrapper>
  );
}
