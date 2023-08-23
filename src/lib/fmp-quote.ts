import { fmpConfig, fmpUrls, indexQuotes } from "@/config/fmp";
import { env } from "@/env.mjs";
import axios from "axios";

export async function getIndexQuotes() {
  try {
    const symbols = ["^GSPC", "^GDAXI", "^NDX", "^DJI"];

    if (fmpConfig.simulation) return indexQuotes;

    const { data } = await axios.get(fmpUrls["indexQuotes"]);

    const results = data.filter((result: any) =>
      symbols.includes(result.symbol)
    );

    return results;
  } catch {
    return null;
  }
}

export async function getQuote(symbol:string) {
  const url = `${FMP_API_URL}v3/quote/${
    Array.isArray(symbols) ? symbols.join(",") : symbols
  }?apikey=${env.FMP_API_KEY}`;

  const response = fmpConfig.simulation
    ? quote
    : await fetch(url, { cache: "no-cache" })
        .then(async (res) => await res.json())
        .catch(() => {
          throw new ServerError("Fetch from FMP failed");
        });

  const quotes = Array.isArray(response) ? response : [response];
  if (!quotes.length) throw new NotFoundError();
}
