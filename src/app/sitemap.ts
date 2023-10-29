import { SITE } from "@/config/site";
import { caller } from "@/trpc";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = `https://www.${SITE.name}.com/`;

  const stocks = await caller.stock.getAll();
  const portfolios = await caller.portfolio.getAllPublic();

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
