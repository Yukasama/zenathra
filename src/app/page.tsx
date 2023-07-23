import { getDailys } from "@/lib/stocks/client/getStocks";
import { CardList, Highlight, Indizes } from "@/components/routes/home";
import { Suspense } from "react";
import { CardsLoading } from "@/components/routes/home/CardList";
import { HighlightLoading } from "@/components/routes/home/Highlight";
import { IndizesLoading } from "@/components/routes/home/Indizes";

export default async function Home() {
  const [actives, winners, losers]: [
    string[] | null,
    string[] | null,
    string[] | null
  ] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  return (
    <div className="m-1 mb-7 f-col gap-6">
      <div className="f-col md:flex-row items-center justify-between gap-4 p-4 md:gap-7 md:p-7">
        <Suspense fallback={<HighlightLoading />}>
          {/*// @ts-ignore*/}
          <Highlight symbol={actives ? actives[0] : null} />
        </Suspense>
        <Suspense fallback={<IndizesLoading />}>
          {/*// @ts-ignore*/}
          <Indizes />
        </Suspense>
        <Suspense fallback={<IndizesLoading />}>
          {/*// @ts-ignore*/}
          <Indizes />
        </Suspense>
      </div>

      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Most Active</p>
        <Suspense fallback={<CardsLoading />}>
          {/*// @ts-ignore*/}
          {actives && <CardList symbols={actives} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Daily Winners</p>
        <Suspense fallback={<CardsLoading />}>
          {/*// @ts-ignore*/}
          {winners && <CardList symbols={winners} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">
          Daily Underperformers
        </p>
        <Suspense fallback={<CardsLoading />}>
          {/*// @ts-ignore*/}
          {losers && <CardList symbols={losers} />}
        </Suspense>
      </div>
    </div>
  );
}
