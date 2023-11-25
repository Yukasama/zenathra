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
import { trpc } from "../../../trpc/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ScreenerProps } from "@/lib/validators/stock";

const ScreenerResults = dynamic(
  () => import("@/app/(stock)/screener/screener-results"),
  {
    ssr: false,
    loading: () => (
      <div className="f-col gap-2 pt-2">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse-right h-[60px]" />
        ))}
      </div>
    ),
  }
);

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: Props) {
  const [resetCounter, setResetCounter] = useState(0);

  const [input, setInput] = useState<ScreenerProps>({
    exchange: "Any",
    ticker: "",
    sector: "Any",
    industry: "Any",
    country: "Any",
    earningsDate: "Any",
    peRatio: ["Any", "Any"],
    pegRatio: ["Any", "Any"],
    marketCap: "Any",
    sma50: ["Any", "Any"],
  });

  const updateFilter = (filterId: any, newValue: any) => {
    setInput((prevState) => ({
      ...prevState,
      [filterId]: newValue,
    }));
  };

  const updateRangeFilter = (filterId: any, index: any, newValue: any) => {
    setInput((prevState: any) => ({
      ...prevState,
      [filterId]: [
        index === 0 ? newValue : prevState[filterId][0],
        index === 1 ? newValue : prevState[filterId][1],
      ],
    }));
  };

  const router = useRouter();

  const cursor =
    typeof searchParams["cursor"] === "string"
      ? Number(searchParams["cursor"])
      : 1;
  const takeParam =
    (typeof searchParams["take"] === "string" &&
      Number(searchParams["take"])) ??
    10;
  const take = takeParam && takeParam >= 1 && takeParam <= 50 ? takeParam : 10;

  // Set all filters on "Any" on reset button click
  const resetFilters = () => {
    setInput({
      exchange: "Any",
      ticker: "",
      sector: "Any",
      industry: "Any",
      country: "Any",
      earningsDate: "Any",
      peRatio: ["Any", "Any"],
      pegRatio: ["Any", "Any"],
      marketCap: "Any",
      sma50: ["Any", "Any"],
    });

    setResetCounter((prevCounter) => prevCounter + 1);
  };

  const {
    data: results,
    isFetched,
    refetch,
  } = trpc.stock.query.useQuery({
    ...input,
    cursor,
    take,
  });

  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, take]);

  useEffect(() => {
    refetch();
    router.replace(`/screener?cursor=1&take=${take}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const descriptive = [
    {
      id: "exchange",
      label: "Exchange",
      value: input.exchange,
      value2: null,
      options: exchanges,
      type: "fixed",
      setOption: (value: string) => updateFilter("exchange", value),
    },
    {
      id: "sector",
      label: "Sector",
      value: input.sector,
      value2: null,
      options: sectors,
      type: "fixed",
      setOption: (value: string) => updateFilter("sector", value),
    },
    {
      id: "industry",
      label: "Industry",
      value: input.industry,
      value2: null,
      options: industries,
      type: "fixed",
      setOption: (value: string) => updateFilter("industry", value),
    },
    {
      id: "country",
      label: "Country",
      value: input.country,
      value2: null,
      options: countries,
      type: "fixed",
      setOption: (value: string) => updateFilter("country", value),
    },
    {
      id: "earningsDate",
      label: "Earnings Date",
      value: input.earningsDate,
      value2: null,
      options: earningsDates,
      type: "fixed",
      setOption: (value: string) => updateFilter("earningsDate", value),
    },
    {
      id: "marketCap",
      label: "Market Cap",
      value: input.marketCap,
      value2: null,
      options: marketCaps,
      type: "fixed",
      setOption: (value: string) => updateFilter("marketCap", value),
    },
  ];

  const fundamental = [
    {
      id: "peRatio",
      label: "P/E Ratio",
      value: input.peRatio[0],
      value2: input.peRatio[1],
      options: peRatios,
      type: "range",
      setOption: (value: string, index?: number) =>
        updateRangeFilter("peRatio", index, value),
    },
    {
      id: "pegRatio",
      label: "PEG Ratio",
      value: input.pegRatio[0],
      value2: input.pegRatio[1],
      options: pegRatios,
      type: "range",
      setOption: (value: string, index?: number) =>
        updateRangeFilter("pegRatio", index, value),
    },
  ];

  const technical = [
    {
      id: "sma50",
      label: "SMA 50",
      value: input.sma50[0],
      value2: input.sma50[1],
      options: ["-20%"],
      type: "range",
      setOption: (value: string, index?: number) =>
        updateRangeFilter("sma50", index, value),
    },
  ];

  const CONFIG = [
    {
      id: "descriptive",
      name: "Descriptive",
      description: "Filters that describe the stock",
      icon: FileText,
      filters: descriptive,
    },
    {
      id: "fundamental",
      name: "Fundamental",
      description: "Filters based on financial statements",
      icon: Layers,
      filters: fundamental,
    },
    {
      id: "technical",
      name: "Technical",
      description: "Filters based on the stock's chart",
      icon: BarChart2,
      filters: technical,
    },
  ];

  return (
    <div className="f-col lg:flex-row w-full gap-5">
      <div className="f-col">
        {/* Stock Filters */}
        <Tabs aria-label="Filters" color="primary" variant="bordered">
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  <entry.icon size={18} />
                  {entry.name}
                </div>
              }>
              <Card>
                <CardHeader>
                  <CardTitle>{entry.name}</CardTitle>
                  <CardDescription>{entry.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.filters.map((filter) => (
                    <div className="f-col" key={filter.id + resetCounter}>
                      <p className="font-medium text-sm m-1 text-zinc-400">
                        {filter.label}
                      </p>
                      <div className="flex gap-4">
                        {filter.type === "range" && (
                          <div className="w-full">
                            <Select
                              onValueChange={(e) => filter.setOption(e, 1)}
                              value={filter.value2!}>
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
                        )}
                        <div className="w-full">
                          <Select
                            onValueChange={(e) => {
                              if (filter.type === "range") {
                                return filter.setOption(e, 0);
                              }
                              filter.setOption(e);
                            }}
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
                          {filter.type === "range" && (
                            <CardDescription className="ml-1 text-[13px]">
                              Maximum Value
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* Screener Results */}
      <div className="f-col w-full flex-1">
        <Tabs aria-label="Options" color="primary" variant="bordered">
          {CONFIG.map((entry) => (
            <Tab
              key={entry.id}
              title={
                <div className="flex items-center gap-2">
                  <entry.icon size={18} />
                  {entry.name}
                </div>
              }>
              <ScreenerResults results={results} isFetched={isFetched} />
            </Tab>
          ))}
        </Tabs>

        {/* Screener Control */}
        <div className="flex gap-3.5 justify-center">
          <Button color="danger" onClick={() => resetFilters()}>
            <RotateCcw size={18} />
            Reset Filters
          </Button>
          {isFetched && results?.length ? (
            <>
              <Link
                href={`/screener?cursor=${
                  cursor >= 1 ? 1 : cursor - 1
                }&take=${take}`}>
                <Button
                  className={`${
                    cursor <= 1 && "pointer-events-none opacity-80"
                  }`}>
                  Previous
                </Button>
              </Link>
              <Link href={`/screener?cursor=${cursor + 1}&take=${take}`}>
                <Button color="primary">Next</Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
