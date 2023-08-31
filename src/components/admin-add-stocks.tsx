"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UploadStockProps, UploadStockSchema } from "@/lib/validators/stock";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Slider } from "./ui/slider";
import { Upload } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

export default function AdminAddStocks() {
  const { loginToast } = useCustomToasts();

  const form = useForm({
    resolver: zodResolver(UploadStockSchema),
  });

  const { mutate: uploadStocks, isLoading } = useMutation({
    mutationFn: async (payload: UploadStockProps) => {
      await axios.post("/api/stock/upload", payload);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          return toast({
            title: "This action is forbidden.",
            description: `We will trace your ip if you try that again.`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Oops! Something went wrong.",
        description: `Stocks could not be uploaded.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Stocks uploaded.",
        description: `Files were successfully added to the database.`,
      });
    },
  });

  function onSubmit(data: FieldValues) {
    const payload: UploadStockProps = {
      stock: data.stock,
      clean: data.clean,
      skip: data.skip,
      pullTimes: data.pullTimes,
    };

    uploadStocks(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stock to upload" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="AAPL">AAPL</SelectItem>
                  <SelectItem value="MSFT">MSFT</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can start a queue of stocks to upload by selecting All
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skip"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clean"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Clean Database</FormLabel>
                <FormDescription>
                  Cleans the database of empty records
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Slider name="pullTimes" defaultValue={[1]} max={100} step={1} />
        <Button isLoading={isLoading}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </form>
    </Form>
  );
}
