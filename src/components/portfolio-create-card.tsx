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
import * as Form from "./ui/form";
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

interface Props {
  numberOfPortfolios?: number;
  onClose?: any;
}

export default function PortfolioCreateCard({
  numberOfPortfolios = 0,
  onClose,
}: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
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
      onClose();

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
        <Card className="f-box min-h-[300px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900">
          <div className={cn(buttonVariants({ size: "sm" }), "bg-primary")}>
            <Plus />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Portfolio</DialogTitle>
          <DialogDescription>
            Create your personal portfolio to track your stocks.
          </DialogDescription>
        </DialogHeader>
        <Form.Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6">
            <Form.FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Title</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      placeholder="Choose your name..."
                      {...field}
                      required
                    />
                  </Form.FormControl>
                  <Form.FormDescription>
                    This is what your portfolio will be called.
                  </Form.FormDescription>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="publicPortfolio"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Make public</Form.FormLabel>
                    <Form.FormDescription>
                      Display portfolio publicly?
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />
            <Button variant="subtle" isLoading={isLoading}>
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </form>
        </Form.Form>
      </DialogContent>
    </Dialog>
  );
}
