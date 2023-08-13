"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { queryStocks } from "@/lib/stock-get";
import {
  sectors,
  industries,
  countries,
  peRatios,
  pegRatios,
  marketCaps,
  earningsDates,
  exchanges,
} from "@/config/screener-values";
import { Screener } from "@/types/stock";
import { Stock } from "@prisma/client";
import { Button, Header, SelectInput } from "@/components/ui";
import { BarChart2, FileText, Layers, RotateCcw } from "react-feather";

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<Stock[] | null>();
  const [active, setActive] = useState<string>("Descriptive");
  const [loading, setLoading] = useState<boolean>(false);

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

  // Async fetch on the client (i know)
  useEffect(() => {
    const inputs: Screener = {
      exchange: exchange,
      sector: sector,
      industry: industry,
      country: country,
      earningsDate: earningsDate,
      peRatio: [peRatio1, peRatio2],
      pegRatio: [pegRatio1, pegRatio2],
      marketCap: marketCap,
    };
    const fetch = async () => {
      setLoading(true);
      setStocks(
        await queryStocks(inputs).then((res) => (res ? res.slice(0, 15) : []))
      );
      setLoading(false);
    };
    fetch();
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

  const ScreenerLoading = () => {
    return (
      <div
        className="animate-pulse-right grid h-[60px] 
        animate-appear-up grid-cols-10 items-center gap-4 rounded-md bg-slate-200 px-4 dark:bg-moon-200 dark:hover:bg-moon-400"></div>
    );
  };

  const ratings: any = {
    Descriptive: <FileText />,
    Fundamental: <Layers />,
    Technical: <BarChart2 />,
  };

  return (
    <div className="grid h-full grid-cols-8">
      <div className="col-span-4 f-col h-full overflow-hidden shadow-md dark:bg-moon-400/30 lg:col-span-3 xl:col-span-2">
        <div className="hidden-scrollbar f-col mt-[2px] h-full overflow-y-auto">
          <div className="sticky top-0 z-10 flex bg-moon-300">
            {Object.keys(ratings).map((rating) => (
              <button
                key={rating}
                onClick={() => setActive(rating)}
                className={`${
                  active === rating &&
                  "border-b border-b-blue-500 bg-slate-200 dark:bg-moon-200"
                } f-box flex-1 cursor-pointer bg-slate-100 p-3 px-5 font-medium hover:bg-slate-200 dark:bg-moon-400/70 dark:hover:bg-moon-200`}>
                <p className="hidden font-light lg:flex">{rating}</p>
                <div className="flex lg:hidden">{ratings[rating]}</div>
              </button>
            ))}
          </div>
          <div
            className={`${
              active !== "Descriptive" && "hidden"
            } f-col gap-4 p-5`}>
            {descriptive.map((item) => (
              <SelectInput
                key={item.id}
                label={item.label}
                options={item.options}
                onChange={item.setOption}
                reset={resetCounter}
                relative
              />
            ))}
          </div>
          <div
            className={`${
              active !== "Fundamental" && "hidden"
            } f-col gap-4 p-5`}>
            {fundamental.map((item) => (
              <>
                {item.type === "single" ? (
                  <SelectInput
                    key={item.id}
                    label={item.label}
                    options={item.options}
                    onChange={item.setOption}
                    reset={resetCounter}
                    relative
                  />
                ) : (
                  <div key={item.id} className="f-col gap-1">
                    <p className="font-medium">{item.label}</p>
                    <div className="flex justify-between gap-3">
                      <SelectInput
                        options={item.options}
                        onChange={item.setOption}
                        reset={resetCounter}
                        relative
                      />
                      <div className="f-box mt-2 h-8 w-8 rounded-md border border-slate-200 p-2 text-lg font-semibold dark:border-moon-100">
                        <p className="mb-0.5">&gt;</p>
                      </div>
                      <SelectInput
                        options={item.options}
                        onChange={item.setOption2!}
                        reset={resetCounter}
                        relative
                      />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
          <div
            className={`${active !== "Technical" && "hidden"} f-col gap-4 p-5`}>
            {technical.map((item) => (
              <>
                {item.type === "single" ? (
                  <SelectInput
                    key={item.id}
                    label={item.label}
                    options={item.options}
                    onChange={item.setOption}
                    reset={resetCounter}
                    relative
                  />
                ) : (
                  <div key={item.id} className="f-col gap-1">
                    <p className="font-medium">{item.label}</p>
                    <div className="flex justify-between gap-3">
                      <SelectInput
                        options={item.options}
                        onChange={item.setOption}
                        reset={resetCounter}
                        relative
                      />
                      <div className="f-box mt-2 h-8 w-8 rounded-md border border-slate-200 p-2 text-lg font-semibold dark:border-moon-100">
                        <p className="mb-0.5">&gt;</p>
                      </div>
                      <SelectInput
                        options={item.options}
                        onChange={item.setOption2!}
                        reset={resetCounter}
                        relative
                      />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="absolute bottom-10 right-5">
            <Button
              label="Reset Filters"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={resetFilters}
            />
          </div>
        </div>
      </div>
      <div className="col-span-4 overflow-auto lg:col-span-5 xl:col-span-6">
        <div>
          <div className="sticky top-0 mb-0.5 grid grid-cols-10 gap-4 bg-slate-100/80 p-3 px-8 dark:bg-moon-300/80">
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
            {loading || !stocks ? (
              <>
                {[...Array(15)].map((_, i) => (
                  <ScreenerLoading key={i} />
                ))}
              </>
            ) : (!stocks || !stocks.length) && !loading ? (
              <Header
                header="No Stocks matching the query."
                subHeader="Maybe try another one"
                className="mt-10"
                center
              />
            ) : (
              <div className="f-col hidden-scrollbar h-[800px] gap-2 overflow-scroll">
                {stocks.map((stock: Stock) => (
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    prefetch={false}
                    key={stock.symbol}
                    className="grid min-h-[60px] grid-cols-10 items-center 
                    gap-4 rounded-md bg-slate-200 px-4 dark:bg-moon-200 dark:hover:bg-moon-400">
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="f-box h-10 w-10 rounded-sm dark:bg-white">
                        <Image
                          src={stock.image}
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
