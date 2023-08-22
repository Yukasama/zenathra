import { NextResponse } from "next/server";
import { fmpUrls } from "@/config/fmp";
import { NotFoundError, ServerError } from "@/lib/response";
import { fmpConfig } from "@/config/fmp";
import { indexQuotes } from "@/config/fmp";

export async function GET() {
  try {
    const symbols = ["^GSPC", "^GDAXI", "^NDX", "^DJI"];

    const response = fmpConfig.simulation
      ? indexQuotes
      : await fetch(fmpUrls["indexQuotes"], { cache: "no-cache" })
          .then(async (res) => await res.json())
          .catch(() => {
            throw new ServerError("Fetch from FMP failed");
          });

    const results = fmpConfig.simulation
      ? response
      : response.filter((result: any) => symbols.includes(result.symbol));

    if (!results.length)
      throw new NotFoundError("No data found for major indices.");

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
