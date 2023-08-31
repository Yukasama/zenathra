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
import SelectInput from "@/components/ui/select-input";
import { StructureProps } from "@/types/layout";
import { BarChart2, FileText, Layers, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const [active, setActive] = useState<string>("Descriptive");

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

      const { data } = await axios.get(`/api/stock/query/${payload}`);
      return data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
    },
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

  function ScreenerItemStructure({ isLoading, children }: StructureProps) {
    return (
      <div
        className={`${isLoading && "animate-pulse-right"} grid h-[60px] 
    animate-appear-up grid-cols-10 items-center gap-4 rounded-md bg-slate-200 px-4 dark:bg-zinc-200 dark:hover:bg-zinc-400`}>
        {children}
      </div>
    );
  }

  function ScreenerItemLoading() {
    return <ScreenerItemStructure isLoading />;
  }

  const ratings: any = {
    Descriptive: <FileText />,
    Fundamental: <Layers />,
    Technical: <BarChart2 />,
  };

  return (
    <div className="grid h-full grid-cols-8">
      <Tabs defaultValue="descriptive" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="descriptive">Descriptive</TabsTrigger>
        <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
      </TabsList>
      <TabsContent value="descriptive">
        {descriptive.map((filter) => (
          <div key={filter.id} className="mb-4">
            <SelectInput
              label={filter.label}
              options={filter.options}
              setOption={filter.setOption}
              resetCounter={resetCounter}
            />
          </div>
        ))}
      </TabsContent>
      </Tabs>
      <div className="col-span-4 overflow-auto lg:col-span-5 xl:col-span-6">
        <div>
          <div className="sticky top-0 mb-0.5 grid grid-cols-10 gap-4 bg-slate-100/80 p-3 px-8 dark:bg-zinc-300/80">
            <p className="col-span-3 rounded-md bg-blue-500 p-1.5 px-3 font-medium text-white">
              Company
            </p>
            <p className="col-span-1 rounded-md bg-blue-500 p-1.5 px-3 font-medium text-white">
              Change
            </p>
            <p className="col-span-1 rounded-md bg-blue-500 p-1.5 px-3 font-medium text-white">
              P/E Ratio
            </p>
            <p className="col-span-2 rounded-md bg-blue-500 p-1.5 px-3 font-medium text-white">
              Sector
            </p>
          </div>
          <div className="f-col mb-5 mt-1 gap-2 px-1 lg:px-8">
            {isFetching ? (
              <>
                {[...Array(15)].map((_, i) => (
                  <ScreenerItemLoading key={i} />
                ))}
              </>
            ) : isFetched && !results?.length ? (
              <p>No Stocks matching the query</p>
            ) : (
              <div className="f-col hidden-scrollbar h-[800px] gap-2 overflow-scroll">
                {results?.map((stock: Stock) => (
                  <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                    <ScreenerItemStructure>
                      <div className="col-span-3 flex items-center gap-4">
                        <div className="f-box h-10 w-10 rounded-sm dark:bg-white">
                          <Image
                            src={stock.image || "/images/stock.jpg"}
                            className="max-h-10 w-10 rounded-md p-1 dark:bg-white"
                            height={30}
                            width={30}
                            alt="Logo"
                            loading="lazy"
                          />
                        </div>
                        <div className="f-col">
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-sm text-slate-700">
                            {stock.companyName}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`p-1.5 ${
                          Number(stock.changes) > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }  col-span-1 font-medium`}>
                        {Number(stock.changes) > 0 && "+"}
                        {stock.changes}
                      </div>
                      <div className="col-span-1 p-1.5">
                        {stock.peRatioTTM ? stock.peRatioTTM.toFixed(2) : 0}
                      </div>
                      <div className="col-span-2 p-1.5">{stock.sector}</div>
                    </ScreenerItemStructure>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
