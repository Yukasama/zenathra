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
} from "@/config/screener/filters";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { BarChart2, FileText, Layers, RotateCcw } from "lucide-react";
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
import StockImage from "@/components/stock/stock-image";
import { trpc } from "../../../trpc/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: Props) {
  const [resetCounter, setResetCounter] = useState(0);

  const [exchange, setExchange] = useState<string>("Any");
  const [ticker, setTicker] = useState<string>("");
  const [sector, setSector] = useState<string>("Any");
  const [industry, setIndustry] = useState<string>("Any");
  const [country, setCountry] = useState<string>("Any");
  const [earningsDate, setEarningsDate] = useState<string>("Any");
  const [marketCap, setMarketCap] = useState<string>("Any");

  const [peRatio1, setPeRatio1] = useState<string>("Any");
  const [peRatio2, setPeRatio2] = useState<string>("Any");
  const [pegRatio1, setPegRatio1] = useState<string>("Any");
  const [pegRatio2, setPegRatio2] = useState<string>("Any");

  const [sma50, setSma50] = useState<string>("Any");
  const [sma502, setSma502] = useState<string>("Any");

  const router = useRouter();
  const cursor =
    typeof searchParams["cursor"] === "string"
      ? Number(searchParams["cursor"])
      : 1;
  const take =
    typeof searchParams["take"] === "string"
      ? Number(searchParams["take"])
      : 13;

  // Set all filters on "Any" on reset button click
  const resetFilters = () => {
    setExchange("Any");
    setTicker("");
    setSector("Any");
    setIndustry("Any");
    setCountry("Any");
    setEarningsDate("Any");
    setMarketCap("Any");
    setPeRatio1("Any");
    setPeRatio2("Any");
    setPegRatio1("Any");
    setPegRatio2("Any");
    setSma50("Any");
    setSma502("Any");

    setResetCounter((prevCounter) => prevCounter + 1);
  };

  const {
    data: results,
    isFetching,
    isFetched,
    refetch,
  } = trpc.stock.query.useQuery({
    cursor: cursor,
    take: take,
    exchange: exchange,
    ticker: ticker,
    sector: sector,
    industry: industry,
    country: country,
    earningsDate: earningsDate,
    peRatio: [peRatio1, peRatio2],
    pegRatio: [pegRatio1, pegRatio2],
    marketCap: marketCap,
  });

  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, take]);

  useEffect(() => {
    refetch();
    router.replace(`/screener?cursor=1&take=${take}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exchange,
    ticker,
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
      value: exchange,
      options: exchanges,
      setOption: setExchange,
    },
    {
      id: "sector",
      label: "Sector",
      value: sector,
      options: sectors,
      setOption: setSector,
    },
    {
      id: "industry",
      label: "Industry",
      value: industry,
      options: industries,
      setOption: setIndustry,
    },
    {
      id: "country",
      label: "Country",
      value: country,
      options: countries,
      setOption: setCountry,
    },
    {
      id: "earningsDate",
      label: "Earnings Date",
      value: earningsDate,
      options: earningsDates,
      setOption: setEarningsDate,
    },
    {
      id: "marketCap",
      label: "Market Cap",
      value: marketCap,
      options: marketCaps,
      setOption: setMarketCap,
    },
  ];

  const fundamental = [
    {
      id: "peRatio",
      label: "P/E Ratio",
      value: peRatio1,
      value2: peRatio2,
      options: peRatios,
      setOption: setPeRatio1,
      setOption2: setPeRatio2,
    },
    {
      id: "pegRatio",
      label: "PEG Ratio",
      value: pegRatio1,
      value2: pegRatio2,
      options: pegRatios,
      setOption: setPegRatio1,
      setOption2: setPegRatio2,
    },
  ];

  const technical = [
    {
      id: "sma",
      label: "SMA",
      value: sma50,
      value2: sma502,
      options: ["50"],
      setOption: setSma50,
      setOption2: setSma502,
    },
  ];

  return (
    <>
      <Tabs aria-label="Filters" color="primary" variant="bordered">
        <Tab
          key="descriptive"
          title={
            <div className="flex items-center gap-2">
              <FileText />
              Descriptive
            </div>
          }>
          <Card>
            <CardHeader>
              <CardTitle>Descriptive</CardTitle>
              <CardDescription>Filters that describe the stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {descriptive.map((filter) => (
                <div className="f-col" key={filter.id + resetCounter}>
                  <p className="font-medium text-sm m-1 text-zinc-400">
                    {filter.label}
                  </p>
                  <Select
                    onValueChange={(e) => filter.setOption(e)}
                    value={filter.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any">
                        {filter.value}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[216px]">
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </Tab>

        <Tab
          key="fundamental"
          title={
            <div className="flex items-center gap-2">
              <Layers />
              Fundamental
            </div>
          }>
          <Card>
            <CardHeader>
              <CardTitle>Fundamental</CardTitle>
              <CardDescription>
                Filters based on financial statements
              </CardDescription>
            </CardHeader>
            <CardContent className="f-col gap-4">
              {fundamental.map((filter) => (
                <div className="f-col" key={filter.id + resetCounter}>
                  <p className="font-medium text-sm m-1 text-zinc-400">
                    {filter.label}
                  </p>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <Select
                        onValueChange={(e) => filter.setOption2(e)}
                        value={filter.value2}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any">
                            {filter.value2}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CardDescription className="ml-1 text-[13px]">
                        Minimum Value
                      </CardDescription>
                    </div>
                    <div className="w-full">
                      <Select
                        onValueChange={(e) => filter.setOption(e)}
                        value={filter.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any">
                            {filter.value}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CardDescription className="ml-1 text-[13px]">
                        Maximum Value
                      </CardDescription>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Tab>

        <Tab
          key="technical"
          title={
            <div className="flex items-center gap-2">
              <BarChart2 />
              Technical
            </div>
          }>
          <Card>
            <CardHeader>
              <CardTitle>Technical</CardTitle>
              <CardDescription>
                Filters based on the stock&apos;s chart
              </CardDescription>
            </CardHeader>
            <CardContent className="f-col gap-4">
              {technical.map((filter) => (
                <div className="f-col" key={filter.id + resetCounter}>
                  <p className="font-medium text-sm m-1 text-zinc-400">
                    {filter.label}
                  </p>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <Select
                        onValueChange={(e) => filter.setOption2(e)}
                        value={filter.value2}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any">
                            {filter.value2}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CardDescription className="ml-1 text-[13px]">
                        Minimum Value
                      </CardDescription>
                    </div>
                    <div className="w-full">
                      <Select
                        onValueChange={(e) => filter.setOption(e)}
                        value={filter.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any">
                            {filter.value}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CardDescription className="ml-1 text-[13px]">
                        Maximum Value
                      </CardDescription>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Tab>

        <Button onClick={() => resetFilters()} className="mt-3">
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </Tabs>

      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        className="w-full">
        <div>
          {isFetching || !results ? (
            <div className="f-col gap-2 pt-2">
              {[...Array(13)].map((_, i) => (
                <Card key={i} className="animate-pulse-right h-[60px]" />
              ))}
            </div>
          ) : isFetched && !results?.length ? (
            <div className="mt-16">
              <h3 className="font-medium text-center text-lg">
                No Stocks matching the query
              </h3>
              <p className="text-sm text-center text-zinc-400">
                Please select a combination of other filters
              </p>
            </div>
          ) : (
            <div className="f-col gap-5">
              <Tab
                key="descriptive"
                title={
                  <div className="flex items-center gap-2">
                    <FileText />
                    Descriptive
                  </div>
                }>
                <div className="f-col hidden-scrollbar max-h-[800px] gap-2 overflow-scroll">
                  {results?.map((stock) => (
                    <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                      <Card className="flex h-[60px] px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                        <div className="col-span-3 flex items-center gap-4">
                          <StockImage src={stock.image} px={30} />
                          <div className="f-col">
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-sm text-zinc-500">
                              {stock.companyName}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Tab>
              <Tab
                key="fundamental"
                title={
                  <div className="flex items-center gap-2">
                    <Layers />
                    Fundamental
                  </div>
                }>
                <div className="f-col hidden-scrollbar h-[800px] gap-2 overflow-scroll">
                  {results?.map((stock) => (
                    <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                      <Card className="flex h-[60px] p-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                        <div className="col-span-3 flex items-center gap-4">
                          <StockImage src={stock.image} px={30} />
                          <div className="f-col">
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-sm text-zinc-500">
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
              </Tab>
              <div className="flex gap-3.5 justify-center">
                <Link
                  href={`/screener?cursor=${
                    cursor >= 1 ? 1 : cursor - 1
                  }&take=${take}`}
                  className={cn(
                    buttonVariants({ variant: "subtle" }),
                    `${cursor <= 1 && "pointer-events-none opacity-80"}`
                  )}>
                  Previous
                </Link>
                <Link
                  href={`/screener?cursor=${cursor + 1}&take=${take}`}
                  className={buttonVariants({ variant: "subtle" })}>
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </>
  );
}
