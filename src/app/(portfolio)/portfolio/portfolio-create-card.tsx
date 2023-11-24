"use client";

import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "../../../components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { trpc } from "@/trpc/client";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";
import { PLANS } from "@/config/stripe";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
  numberOfPortfolios?: number;
}

export default function PortfolioCreateCard({ numberOfPortfolios = 0 }: Props) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: "",
      isPublic: false,
    },
  });

  const { mutate: createPortfolio, isLoading } =
    trpc.portfolio.create.useMutation({
      onError: () => {
        toast({
          title: "Oops! Something went wrong.",
          description: "Failed to create portfolio.",
          variant: "destructive",
        });
      },
      onSuccess: () => router.refresh(),
    });

  function onSubmit(data: FieldValues) {
    if (numberOfPortfolios >= PLANS[0].maxPortfolios) {
      return toast({
        title: "Oops! Something went wrong.",
        description: "Maximum number of portfolios reached.",
        variant: "destructive",
      });
    }

    createPortfolio({
      title: data.title,
      isPublic: data.isPublic,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={isLoading}>
        <motion.div
          variants={ANIMATION_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileTap="tap"
          className={numberOfPortfolios === 0 ? "h-[340px]" : ""}>
          <Card className="f-box cursor-pointer h-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <Button color="primary" isLoading={isLoading} isIconOnly>
              {!isLoading && <Plus />}
            </Button>
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
              name="isPublic"
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

            <DialogClose asChild>
              <Button
                color="primary"
                className="w-full"
                type="submit"
                isLoading={isLoading}>
                {!isLoading && <Plus size={18} />}
                Create Portfolio
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
