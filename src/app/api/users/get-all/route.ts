import { db } from "@/lib/db";
import { ServerError } from "@/lib/response";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const symbols = await db.user.findMany();

    if (!symbols) throw new ServerError("Symbols could not be fetched.");

    return NextResponse.json(symbols);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
