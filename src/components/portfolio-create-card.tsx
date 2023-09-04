"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button, buttonVariants } from "./ui/button";
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
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card } from "./ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";

interface Props {
  numberOfPortfolios?: number;
}

export default function PortfolioCreateCard({ numberOfPortfolios = 0 }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: "",
      publicPortfolio: false,
    },
  });

  const { mutate: createPortfolio, isLoading } = useMutation({
    mutationFn: async (data: CreatePortfolioProps) => {
      if (data.title.length < 1)
        return toast({
          title: "Oops! Something went wrong.",
          description: "Please choose a longer title.",
        });
      if (data.title.length > 30)
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

      toast({
        description: `Portfolio successfully created.`,
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
    <Dialog>
      <DialogTrigger asChild>
        <Card className="f-box cursor-pointer min-h-[240px] hover:bg-slate-100 dark:hover:bg-slate-900">
          <div className={cn(buttonVariants({ size: "sm" }), "bg-primary")}>
            <Plus />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-[375px]">
        <DialogHeader>
          <DialogTitle>Create Portfolio</DialogTitle>
          <DialogDescription>
            Create a personal portfolio to track your stocks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose your title..."
                      {...field}
                      required
                    />
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
                    <FormDescription>
                      Display portfolio publicly?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button variant="subtle" isLoading={isLoading}>
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
