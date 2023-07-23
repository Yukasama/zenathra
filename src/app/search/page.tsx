import { Suspense } from "react";
import Loader from "@/components/routes/Loader";
import { searchStocks } from "@/lib/stocks/client/getStocks";
import notFound from "@/app/not-found";
import SearchResults from "@/components/routes/search/SearchResults";

interface Props {
  searchParams?: { [key: string]: string | undefined };
}

export default async function Search({ searchParams }: Props) {
  const search: string | undefined = searchParams
    ? searchParams["q"]
    : undefined;

  if (!search) return notFound();

  const stocks = await searchStocks(search);

  if (!stocks) return <Loader />;

  return (
    <div className="f-col p-10">
      <p className="p-2 px-3 text-[25px] font-thin">
        Search Results for: {search}
      </p>
      <Suspense fallback={<Loader />}>
        {/*// @ts-ignore*/}
        <SearchResults search={search} />
      </Suspense>
    </div>
  );
}
