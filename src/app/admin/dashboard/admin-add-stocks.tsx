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
import { UploadStockSchema } from "@/lib/validators/stock";
import { Checkbox } from "../../../components/ui/checkbox";
import { Slider } from "../../../components/ui/slider";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { trpc } from "@/app/_trpc/client";

export default function AdminAddStocks() {
  const form = useForm({
    resolver: zodResolver(UploadStockSchema),
    defaultValues: {
      stock: "All",
      clean: true,
      skip: false,
      pullTimes: 1,
    },
  });

  const stocks = ["All", "US500", "AAPL", "MSFT", "TSLA"];

  const { mutate: uploadStocks, isLoading } = trpc.database.upload.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: `${form.getValues("stock")} could not be uploaded.`,
        variant: "destructive",
      }),
    onSuccess: () =>
      toast({
        title: `${form.getValues("stock")} uploaded.`,
        description: "Files were successfully added to the database.",
      }),
  });

  function onSubmit(data: FieldValues) {
    const payload = {
      stock: data.stock,
      clean: data.clean,
      skip: data.skip,
      pullTimes: data.pullTimes,
    };

    uploadStocks(payload);
  }

  return (
    <Card className="w-[400px] sm:w-[500px]">
      <CardHeader>
        <CardTitle>Upload Stocks</CardTitle>
        <CardDescription>Upload stock data to the database</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Symbols
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stock to upload" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stocks.map((stock) => (
                        <SelectItem key={stock} value={stock}>
                          {stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Start a uploading queue by selecting All or US500
                  </FormDescription>
                  <FormMessage className="text-red-500" />
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
                    <FormLabel className="text-black dark:text-white">
                      Skip Stocks
                    </FormLabel>
                    <FormDescription>
                      This will skip stocks that already exist in the database
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
                    <FormLabel className="text-black dark:text-white">
                      Clean Database
                    </FormLabel>
                    <FormDescription>
                      Cleans the database of empty records
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pullTimes"
              render={({ field }) => (
                <FormItem className="f-col items-start space-y-3 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-black dark:text-white">
                      Pull Times
                    </FormLabel>
                    <FormDescription>
                      {form.getValues("pullTimes")} batches of data to pull (~30
                      stocks/batch)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Slider
                      name="pullTimes"
                      max={100}
                      min={1}
                      defaultValue={[1]}
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("pullTimes", value[0]);
                      }}>
                      {field.value}
                    </Slider>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="subtle" isLoading={isLoading}>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
