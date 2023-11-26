"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/button";
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
import { Checkbox } from "@nextui-org/checkbox";
import { Slider } from "@nextui-org/slider";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/trpc/client";

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

  const { mutate: uploadStocks, isLoading } = trpc.stock.upload.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `${form.getValues("stock")} could not be uploaded.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: `${form.getValues("stock")} uploaded.`,
        description: "Files were successfully added to the database.",
      });
    },
  });

  return (
    <Card className="w-[400px] sm:w-[500px]">
      <CardHeader>
        <CardTitle>Upload Stocks</CardTitle>
        <CardDescription>Upload stock data to the database</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => uploadStocks(form.getValues()))}
            className="space-y-6">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbols</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skip"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md border p-4 bg-background">
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Skip Stocks</FormLabel>
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
                <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md border p-4 bg-background">
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
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
            <FormField
              control={form.control}
              name="pullTimes"
              render={({ field }) => (
                <FormItem className="f-col items-start space-y-3 rounded-md border p-4 pb-8 bg-background">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pull Times</FormLabel>
                    <FormDescription>
                      {form.getValues("pullTimes")} batches of data to pull (~30
                      stocks/batch)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Slider
                      aria-label="Pull Times"
                      name="pullTimes"
                      maxValue={100}
                      minValue={1}
                      step={1}
                      defaultValue={1}
                      value={field.value}
                      marks={[
                        {
                          value: 20,
                          label: "20 Batches",
                        },
                        {
                          value: 50,
                          label: "50 Batches",
                        },
                        {
                          value: 80,
                          label: "80 Batches",
                        },
                      ]}
                      onChange={field.onChange}>
                      {field.value}
                    </Slider>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button color="primary" isLoading={isLoading} type="submit">
              {!isLoading && <Upload size={18} />}
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
