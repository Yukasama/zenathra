"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  sectors,
  industries,
  countries,
  peRatios,
  pegRatios,
  marketCaps,
  earningsDates,
  exchanges,
} from "@/config/screener";
import { Prisma, Stock } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { BarChart2, FileText, Layers, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageLayout from "@/components/shared/page-layout";
import { StockImage } from "@/components/stock-image";
import { StockScreenerProps } from "@/lib/validators/stock";

export default function Page() {
  const [resetCounter, setResetCounter] = useState(0);

  const [exchange, setExchange] = useState<string>("Any");
  const [sector, setSector] = useState<string>("Any");
  const [industry, setIndustry] = useState<string>("Any");
  const [country, setCountry] = useState<string>("Any");
  const [earningsDate, setEarningsDate] = useState<string>("Any");
  const [marketCap, setMarketCap] = useState<string>("Any");

  const [peRatio1, setPeRatio1] = useState<string>("Any (Maximum)");
  const [peRatio2, setPeRatio2] = useState<string>("Any (Minimum)");
  const [pegRatio1, setPegRatio1] = useState<string>("Any (Maximum)");
  const [pegRatio2, setPegRatio2] = useState<string>("Any (Minimum)");

  // Set all filters on "Any" on reset button click
  const resetFilters = () => {
    setExchange("Any");
    setSector("Any");
    setIndustry("Any");
    setCountry("Any");
    setEarningsDate("Any");
    setMarketCap("Any");
    setPeRatio1("Any (Maximum)");
    setPeRatio2("Any (Minimum)");
    setPegRatio1("Any (Maximum)");
    setPegRatio2("Any (Minimum)");

    setResetCounter((prevCounter) => prevCounter + 1);
  };

  const {
    data: results,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const payload: StockScreenerProps = {
        exchange: exchange,
        sector: sector,
        industry: industry,
        country: country,
        earningsDate: earningsDate,
        peRatio: [peRatio1, peRatio2],
        pegRatio: [pegRatio1, pegRatio2],
        marketCap: marketCap,
      };

      const { data } = await axios.post("/api/stock/query", payload);
      return data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
    },
    queryKey: ["screener-query"],
  });

  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exchange,
    sector,
    industry,
    country,
    earningsDate,
    peRatio1,
    peRatio2,
    pegRatio1,
    pegRatio2,
    marketCap,
  ]);

  const descriptive = [
    {
      id: "exchange",
      label: "Exchange",
      options: exchanges,
      setOption: setExchange,
    },
    {
      id: "sector",
      label: "Sector",
      options: sectors,
      setOption: setSector,
    },
    {
      id: "industry",
      label: "Industry",
      options: industries,
      setOption: setIndustry,
    },
    {
      id: "country",
      label: "Country",
      options: countries,
      setOption: setCountry,
    },
    {
      id: "earningsDate",
      label: "Earnings Date",
      options: earningsDates,
      setOption: setEarningsDate,
    },
    {
      id: "marketCap",
      type: "single",
      label: "Market Cap",
      options: marketCaps,
      setOption: setMarketCap,
    },
  ];

  const fundamental = [
    {
      id: "peRatio",
      label: "P/E Ratio",
      options: peRatios,
      setOption: setPeRatio1,
      setOption2: setPeRatio2,
    },
    {
      id: "pegRatio",
      label: "PEG Ratio",
      options: pegRatios,
      setOption: setPegRatio1,
      setOption2: setPegRatio2,
    },
  ];

  const technical = [
    {
      id: "peRatio",
      label: "P/E Ratio",
      options: peRatios,
      setOption: setPeRatio1,
      setOption2: setPeRatio2,
    },
    {
      id: "pegRatio",
      label: "PEG Ratio",
      options: pegRatios,
      setOption: setPegRatio1,
      setOption2: setPegRatio2,
    },
  ];

  return (
    <PageLayout className="flex f-col gap-5 lg:flex-row">
      <Button
        variant="subtle"
        onClick={() => resetFilters()}
        className="absolute bottom-4 lg:bottom-7">
        <RotateCcw className="h-4" />
        Reset Filters
      </Button>
      <Tabs defaultValue="descriptive">
        <TabsList>
          <TabsTrigger className="flex gap-1" value="descriptive">
            <FileText />
            Descriptive
          </TabsTrigger>
          <TabsTrigger className="flex gap-1" value="fundamental">
            <Layers />
            Fundamental
          </TabsTrigger>
          <TabsTrigger className="flex gap-1" value="technical">
            <BarChart2 />
            Technical
          </TabsTrigger>
        </TabsList>
        <TabsContent value="descriptive">
          <Card>
            <CardHeader>
              <CardTitle>Descriptive</CardTitle>
              <CardDescription>Filters that describe the stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {descriptive.map((filter) => (
                <div className="f-col" key={filter.id}>
                  <p className="font-medium text-sm m-1 text-slate-400">
                    {filter.label}
                  </p>
                  <Select onValueChange={(e) => filter.setOption(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[216px]">
                      {filter.options.map((option) => (
                        <SelectItem key={option + resetCounter} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fundamental">
          <Card>
            <CardHeader>
              <CardTitle>Fundamental</CardTitle>
              <CardDescription>
                Filters based on financial statements
              </CardDescription>
            </CardHeader>
            <CardContent className="f-col gap-4">
              {fundamental.map((filter) => (
                <div className="f-col" key={filter.id}>
                  <p className="font-medium text-sm m-1 text-slate-400">
                    {filter.label}
                  </p>
                  <div className="flex gap-4">
                    <Select onValueChange={(e) => filter.setOption(e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any (Maximum)" />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any (Minimum)" />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            onChange={() => filter.setOption2(option)}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical</CardTitle>
              <CardDescription>
                Filters based on the stock&apos;s chart
              </CardDescription>
            </CardHeader>
            <CardContent className="f-col gap-4">
              {technical.map((filter) => (
                <div className="f-col" key={filter.id}>
                  <p className="font-medium text-sm m-1 text-slate-400">
                    {filter.label}
                  </p>
                  <div className="flex gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any (Maximum)" />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            onChange={() => filter.setOption(option)}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any (Minimum)" />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            onChange={() => filter.setOption2(option)}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="descriptive" className="w-full">
        <TabsList>
          <TabsTrigger className="flex gap-1" value="descriptive">
            <FileText />
            Descriptive
          </TabsTrigger>
          <TabsTrigger className="flex gap-1" value="fundamental">
            <Layers />
            Fundamental
          </TabsTrigger>
          <TabsTrigger className="flex gap-1" value="technical">
            <BarChart2 />
            Technical
          </TabsTrigger>
        </TabsList>
        <div>
          {isFetching || !results ? (
            <div className="f-col gap-2 pt-2">
              {[...Array(13)].map((_, i) => (
                <Card key={i} className="animate-pulse-right h-[60px]" />
              ))}
            </div>
          ) : isFetched && !results?.length ? (
            <p>No Stocks matching the query</p>
          ) : (
            <>
              <TabsContent value="descriptive">
                <div className="f-col hidden-scrollbar max-h-[800px] gap-2 overflow-scroll">
                  {results?.map((stock: Stock) => (
                    <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                      <Card className="flex h-[60px] px-4 hover:bg-slate-100 dark:hover:bg-slate-900">
                        <div className="col-span-3 flex items-center gap-4">
                          <StockImage src={stock.image} px={30} />
                          <div className="f-col">
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-sm text-slate-500">
                              {stock.companyName}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="fundamental">
                <div className="f-col hidden-scrollbar h-[800px] gap-2 overflow-scroll">
                  {results?.map((stock: Stock) => (
                    <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                      <Card className="flex h-[60px] p-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-900">
                        <div className="col-span-3 flex items-center gap-4">
                          <StockImage src={stock.image} px={30} />
                          <div className="f-col">
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-sm text-slate-500">
                              {stock.companyName}
                            </p>
                          </div>
                          <div
                            className={buttonVariants({ variant: "subtle" })}>
                            {stock.sector}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </PageLayout>
  );
}
