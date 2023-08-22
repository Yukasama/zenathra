import { db } from "@/lib/db";
import { ServerError } from "@/lib/response";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const portfolios = await db.portfolio.findMany({
      where: {
        public: true,
      },
    });

    if (!portfolios) throw new ServerError("Symbols could not be fetched.");

    return NextResponse.json(portfolios);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
