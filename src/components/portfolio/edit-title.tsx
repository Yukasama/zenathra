"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditPortfolioSchema } from "@/lib/validators/portfolio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Portfolio } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useForm, FieldValues } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
  portfolio: Pick<Portfolio, "id">;
}

export default function EditTitle({ portfolio }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(EditPortfolioSchema),
    defaultValues: { title: "" },
  });

  const { mutate: editTitle, isLoading } = trpc.portfolio.edit.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to change portfolio title.`,
        variant: "destructive",
      }),
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({ description: `Title successfully changed.` });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload = {
      portfolioId: portfolio.id,
      title: data.title,
    };

    editTitle(payload);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="f-box cursor-pointer">
          <Pencil className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>Change Portfolio Title</DialogTitle>
          <DialogDescription>
            Choose a new title for your portfolio.
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
                      placeholder="Choose your new title..."
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
            <DialogClose>
              <Button variant="subtle" isLoading={isLoading}>
                <Pencil className="h-4 w-4" />
                Change Title
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
