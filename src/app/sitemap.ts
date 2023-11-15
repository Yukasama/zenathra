import { SITE } from "@/config/site";
import { db } from "@/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = `https://www.${SITE.name.toLowerCase()}.com/`;

  const [stocks, portfolios] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true },
      orderBy: { symbol: "asc" },
    }),
    db.portfolio.findMany({
      select: { id: true },
      where: { public: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return [
    {
      url: "${url}",
    },
    {
      url: "${url}about/",
    },
    {
      url: "${url}contact/",
    },
    {
      url: "${url}pricing/",
    },
    {
      url: "${url}privacy-policy/",
    },
    {
      url: "${url}support/",
    },
    {
      url: "${url}terms/",
    },
    {
      url: "${url}economic-calendar",
    },
    {
      url: "${url}screener",
    },
    {
      url: "${url}stocks",
    },
    ...(stocks
      ? stocks.map((stock) => ({
          url: `${url}stocks/${stock.symbol}`,
        }))
      : []),
    ...(portfolios
      ? portfolios.map((portfolio) => ({
          url: `${url}p/${portfolio.id}`,
        }))
      : []),
  ];
}
