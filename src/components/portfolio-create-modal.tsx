"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from "@/lib/validators/portfolio";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { title } from "process";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  numberOfPortfolios?: number;
  onClose?: any;
}

export default function PortfolioCreateModal({
  numberOfPortfolios = 0,
  onClose,
}: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
  });

  const { mutate: createPortfolio, isLoading } = useMutation({
    mutationFn: async (data: CreatePortfolioProps) => {
      if (title.length < 1)
        return toast({
          title: "Oops! Something went wrong.",
          description: "Please choose a longer title.",
        });
      if (title.length > 30)
        return toast({
          title: "Oops! Something went wrong.",
          description: "Please choose a shorter title.",
        });
      if (numberOfPortfolios >= 3)
        return toast({
          title: "Oops! Something went wrong.",
          description: "Maximum number of portfolios reached.",
        });

      await axios.post("/api/portfolio/create", { ...data });
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to create portfolio.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      onClose();

      toast({
        description: `Portfolio ${title} successfully created.`,
      });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: CreatePortfolioProps = {
      title: data.title,
      publicPortfolio: data.publicPortfolio,
    };
    createPortfolio(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Choose your name..." {...field} required />
              </FormControl>
              <FormDescription>
                This is what your portfolio will be called.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publicPortfolio"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Make public</FormLabel>
                <FormDescription>Display portfolio publicly?</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button isLoading={isLoading}>
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Button>
      </form>
    </Form>
  );
}
