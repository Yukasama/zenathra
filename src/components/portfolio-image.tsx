import { Portfolio } from "@prisma/client";

interface Props {
  portfolio: Pick<Portfolio, "title" | "color">;
}

export default function PortfolioImage({ portfolio }: Props) {
  return (
    <div
      className="h-10 w-10 f-box rounded-full border text-lg"
      style={{
        backgroundColor: portfolio.color ?? "#000",
      }}>
      {portfolio.title[0].toUpperCase()}
    </div>
  );
}
