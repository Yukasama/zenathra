"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Button, Checkbox, Progress, Slider } from "@nextui-org/react";
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

  const stocks = ["All", "US500", "AAPL", "MSFT", "GOOG", "TSLA", "NVDA"];

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

  function onSubmit(data: FieldValues) {
    if (!["All", "US500"].includes(data.stock) && data.pullTimes > 1) {
      return toast({
        title: "Oops! Something went wrong.",
        description: `You can only upload one batch of data for single stocks.`,
        variant: "destructive",
      });
    }

    uploadStocks({
      stock: data.stock,
      clean: data.clean,
      skip: data.skip,
      pullTimes: data.pullTimes,
    });
  }

  return (
    <Card className="w-[400px] sm:w-[500px] overflow-hidden">
      {isLoading ? (
        <Progress
          size="sm"
          isIndeterminate
          classNames={{
            indicator: "bg-gradient-to-r from-primary to-amber-500",
          }}
        />
      ) : (
        <div className="w-full h-1" />
      )}
      <div className={`${isLoading && "opacity-70"}`}>
        <CardHeader className="-mt-0.5">
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
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
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
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
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
              <FormField
                control={form.control}
                name="pullTimes"
                render={({ field }) => (
                  <FormItem className="f-col items-start space-y-3 rounded-md border p-4 pb-8 bg-background">
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pull Times</FormLabel>
                      <FormDescription>
                        {form.getValues("pullTimes")} batches of data to pull
                        (~30 stocks/batch)
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
                            label: "20 Bat.",
                          },
                          {
                            value: 50,
                            label: "50 Bat.",
                          },
                          {
                            value: 80,
                            label: "80 Bat.",
                          },
                        ]}
                        onChange={field.onChange}>
                        {field.value}
                      </Slider>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                color="primary"
                isLoading={isLoading}
                type="submit"
                aria-label="Upload stocks">
                {!isLoading && <Upload size={18} />}
                Upload
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
