"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Screener } from "@/types/stock";
import { Prisma, Stock } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { StructureProps } from "@/types/layout";
import { BarChart2, FileText, Layers, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
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
import { StockImage } from "@/components/shared/stock-image";

export default function Page() {
  const [resetCounter, setResetCounter] = useState(0);

  const [exchange, setExchange] = useState<string>("Any");
  const [sector, setSector] = useState<string>("Any");
  const [industry, setIndustry] = useState<string>("Any");
  const [country, setCountry] = useState<string>("Any");
  const [earningsDate, setEarningsDate] = useState<string>("Any");
  const [marketCap, setMarketCap] = useState<string>("Any");

  const [peRatio1, setPeRatio1] = useState<string>("Any");
  const [peRatio2, setPeRatio2] = useState<string>("Any");
  const [pegRatio1, setPegRatio1] = useState<string>("Any");
  const [pegRatio2, setPegRatio2] = useState<string>("Any");

  // Set all filters on "Any" on reset button click
  const resetFilters = () => {
    setResetCounter((prevCounter) => prevCounter + 1);
  };

  const {
    data: results,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const payload: Screener = {
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
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    debounceRequest();

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
      type: "single",
      label: "Exchange",
      options: exchanges,
      setOption: setExchange,
    },
    {
      id: "sector",
      type: "single",
      label: "Sector",
      options: sectors,
      setOption: setSector,
    },
    {
      id: "industry",
      type: "single",
      label: "Industry",
      options: industries,
      setOption: setIndustry,
    },
    {
      id: "country",
      type: "single",
      label: "Country",
      options: countries,
      setOption: setCountry,
    },
    {
      id: "earningsDate",
      type: "single",
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
      type: "double",
      label: "P/E Ratio",
      options: peRatios,
      setOption: setPeRatio1,
      setOption2: setPeRatio2,
    },
    {
      id: "pegRatio",
      type: "double",
      label: "PEG Ratio",
      options: pegRatios,
      setOption: setPegRatio1,
      setOption2: setPegRatio2,
    },
  ];

  const technical = [
    {
      id: "peRatio",
      type: "double",
      label: "P/E Ratio",
      options: peRatios,
      setOption: setPeRatio1,
      setOption2: setPeRatio2,
    },
    {
      id: "pegRatio",
      type: "double",
      label: "PEG Ratio",
      options: pegRatios,
      setOption: setPegRatio1,
      setOption2: setPegRatio2,
    },
  ];

  return (
    <PageLayout className="flex">
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
                <Select key={filter.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[216px]">
                    {filter.options.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        onChange={() => filter.setOption(option)}>
                        <p className="truncate w-[270px]">{option}</p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select key={filter.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
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
              {descriptive.map((filter) => (
                <Select key={filter.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
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
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="f-col mb-5 mt-1 gap-2 px-1 lg:px-8 w-full">
        {isFetching ? (
          <>
            {[...Array(15)].map((_, i) => (
              <Card key={i} className="bg-red-500" />
            ))}
          </>
        ) : isFetched && !results?.length ? (
          <p>No Stocks matching the query</p>
        ) : (
          <div className="f-col hidden-scrollbar h-[800px] gap-2 overflow-scroll">
            {results?.map((stock: Stock) => (
              <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                <Card className="flex p-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-900">
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
        )}
      </div>
    </PageLayout>
  );
}
