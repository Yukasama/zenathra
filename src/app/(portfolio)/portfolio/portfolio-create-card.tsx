"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { buttonVariants } from "../../../components/ui/button";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "../../../components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
} from "../../../components/ui/dialog";
import { Card } from "../../../components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../../components/ui/form";
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "@/config/motion";
import { trpc } from "@/app/_trpc/client";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";

interface Props {
  numberOfPortfolios?: number;
}

export default function PortfolioCreateCard({ numberOfPortfolios = 0 }: Props) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: "",
      public: false,
    },
  });

  const { mutate: createPortfolio, isLoading } =
    trpc.portfolio.create.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: "Failed to create portfolio.",
          variant: "destructive",
        }),
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({ description: "Portfolio successfully created." });
      },
    });

  function onSubmit(data: FieldValues) {
    if (numberOfPortfolios >= 3)
      return toast({
        title: "Oops! Something went wrong.",
        description: "Maximum number of portfolios reached.",
        variant: "destructive",
      });

    createPortfolio({
      title: data.title,
      public: data.public,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          variants={ANIMATION_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileTap="tap"
          className={numberOfPortfolios === 0 ? "h-72" : ""}>
          <Card className="f-box cursor-pointer h-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <div
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-primary hover:bg-primary"
              )}>
              <Plus />
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
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
                  <FormLabel className="text-black dark:text-white">
                    Title
                  </FormLabel>
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
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-black dark:text-white">
                      Make public
                    </FormLabel>
                    <FormDescription>
                      Display portfolio publicly?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              className="bg-primary"
              type="submit"
              isLoading={isLoading}
              startContent={!isLoading && <Plus className="h-4 w-4" />}>
              Create Portfolio
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
