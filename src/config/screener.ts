import { Prisma } from "@prisma/client";
import { ScreenerProps } from "@/lib/validators/screener";

export function buildFilter(screener: ScreenerProps) {
  const filter: Prisma.StockWhereInput = {};

  if (screener.exchange && screener.exchange !== "Any")
    filter.exchangeShortName = screener.exchange;
  if (screener.sector && screener.sector !== "Any")
    filter.sector = screener.sector;
  if (screener.industry && screener.industry !== "Any")
    filter.industry = screener.industry;
  if (screener.country && screener.country !== "Any")
    filter.country = screener.country;

  if (screener.marketCap && screener.marketCap !== "Any") {
    const marketCapMapping: any = {
      "Mega (100 Bil.)": 100_000_000_000,
      "Large (10 Bil.)": 10_000_000_000,
      "Medium (1 Bil.)": 1_000_000_000,
      "Small (50 Mil.)": 50_000_000,
    };

    if (screener.marketCap in marketCapMapping)
      filter.marketCapTTM = { gte: marketCapMapping[screener.marketCap] };
  }

  if (
    screener.peRatio ||
    (screener.peRatio[0] === "Any" && screener.peRatio[1] === "Any")
  ) {
    const [left, right] = screener.peRatio;
    let peRatioFilter: Prisma.FloatFilter | undefined;

    if (left === ">50") peRatioFilter = { lt: 50 };
    else if (right === ">50") peRatioFilter = { gt: 50 };
    else if (left !== "Any" && right !== "Any")
      peRatioFilter = {
        lte: parseFloat(left),
        gte: parseFloat(right),
      };
    else if (left !== "Any") peRatioFilter = { lte: Number(left) };
    else if (right !== "Any") peRatioFilter = { gte: Number(right) };

    if (peRatioFilter) filter.peRatioTTM = peRatioFilter;
  }

  if (
    screener.pegRatio ||
    (screener.pegRatio[0] === "Any" && screener.pegRatio[1] === "Any")
  ) {
    const [left, right] = screener.pegRatio;
    let pegRatioFilter: Prisma.FloatFilter | undefined;

    if (left === ">10") pegRatioFilter = { lt: 10 };
    else if (right === ">10") pegRatioFilter = { gt: 10 };
    else if (left !== "Any" && right !== "Any")
      pegRatioFilter = {
        lte: Number(left),
        gte: Number(right),
      };
    else if (left !== "Any") pegRatioFilter = { lte: Number(left) };
    else if (right !== "Any") pegRatioFilter = { gte: Number(right) };

    if (pegRatioFilter) filter.pegRatioTTM = pegRatioFilter;
  }

  return filter;
}

export const exchanges = ["Any", "NYSE", "NASDAQ", "AMEX"];

export const sectors = [
  "Any",
  "Basic Materials",
  "Communication Services",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Energy",
  "Financial Services",
  "Healthcare",
  "Industrials",
  "Real Estate",
  "Technology",
  "Utilities",
];

export const industries = [
  "Any",
  "Aerospace & Defense",
  "Automobiles & Components",
  "Banks",
  "Building Products",
  "Capital Markets",
  "Chemicals",
  "Communications Equipment",
  "Construction & Engineering",
  "Construction Materials",
  "Consumer Electronics",
  "Containers & Packaging",
  "Diversified Financials",
  "Diversified Telecommunication Services",
  "Electric Utilities",
  "Electrical Equipment",
  "Entertainment",
  "Equity Real Estate Investment Trusts (REITs)",
  "Food & Staples Retailing",
  "Food, Beverage & Tobacco",
  "Gas Utilities",
  "Health Care Equipment & Supplies",
  "Health Care Providers & Services",
  "Hotels, Restaurants & Leisure",
  "Household & Personal Products",
  "Industrial Conglomerates",
  "IT Services",
  "Machinery",
  "Media",
  "Metals & Mining",
  "Multi-Utilities",
  "Oil, Gas & Consumable Fuels",
  "Paper & Forest Products",
  "Pharmaceuticals, Biotechnology & Life Sciences",
  "Real Estate Management & Development",
  "Retailing",
  "Semiconductors & Semiconductor Equipment",
  "Software & Services",
  "Technology Hardware & Equipment",
  "Trading Companies & Distributors",
  "Water Utilities",
];

export const countries = [
  "Any",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "Russia",
  "South Korea",
  "Spain",
  "United Kingdom",
  "United States",
];

export const earningsDates = [
  "Any",
  "Today",
  "Tomorrow",
  "This Week",
  "+2 Weeks",
  "+1 Month",
];

export const marketCaps = [
  "Any",
  "Mega (100 Bil.)",
  "Large (10 Bil.)",
  "Medium (1 Bil.)",
  "Small (50 Mil.)",
];

export const peRatios = ["Any", "0", "10", "20", "30", "40", ">50"];

export const pegRatios = ["Any", "0", "1", "2", "3", "5", ">10"];
