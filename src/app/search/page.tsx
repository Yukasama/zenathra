import { Suspense } from "react";
import { SearchResults } from "@/components";
import { searchStocks } from "@/lib/stock-get";
import notFound from "@/app/not-found";
import { redirect } from "next/navigation";

interface Props {
  searchParams?: { [key: string]: string | undefined };
}

export default async function Search({ searchParams }: Props) {
  const search: string | undefined = searchParams
    ? searchParams["q"]
    : undefined;

  if (!search) return notFound();

  const stocks = await searchStocks(search);
  if (!stocks) return <p>No stocks found.</p>;

  if (stocks.some((stock) => stock.symbol === search))
    redirect(`/stocks/${search}`);

  return (
    <div className="f-col p-10">
      <p className="p-2 px-3 text-[25px] font-thin">
        Search Results for: {search}
      </p>
      <Suspense fallback={<p>Loading...</p>}>
        <SearchResults results={stocks} />
      </Suspense>
    </div>
  );
}
