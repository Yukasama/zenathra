"use client";

import { useRouter } from "next/navigation";
import { Button, Checkbox } from "@nextui-org/react";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";
import { PLANS } from "@/config/stripe";

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
        <Button
          isLoading={isLoading}
          className="h-[340px]"
          variant="flat"
          aria-label="Create portfolio">
          {!isLoading && (
            <div className="h-9 w-9 f-box rounded-lg bg-primary text-white">
              <Plus size={20} />
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
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
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
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
            <Button
              color="primary"
              className="w-full"
              type="submit"
              aria-label="Create portfolio"
              isLoading={isLoading}>
              {!isLoading && <Plus size={18} />}
              Create Portfolio
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
