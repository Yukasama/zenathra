import { Stock } from "@prisma/client";
import { Card } from "./ui/card";

interface Props {
  stock: Stock | null;
}

export default function StockMetrics({ stock }: Props) {
  const data = [
    {
      title: "P/E Ratio",
      value: stock ? stock.peRatioTTM.toFixed(2) : "N/A",
    },
    {
      title: "Earnings Per Share",
      value: stock ? stock.netIncomePerShareTTM?.toFixed(2) : "N/A",
    },
    {
      title: "P/B Ratio",
      value: stock ? stock.priceToBookRatioTTM.toFixed(2) : "N/A",
    },
  ];

  return (
    <Card className="f-col py-1">
      {data.map((d) => (
        <div
          key={d.title}
          className="flex animate-appear-up items-center gap-2 p-2 px-5">
          <p className="w-40 text-sm">{d.title}</p>
          <p className="font-medium">{d.value}</p>
        </div>
      ))}
    </Card>
  );
}
