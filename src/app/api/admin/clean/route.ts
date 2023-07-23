import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ArgumentError, PermissionError } from "@/lib/errors";
import { getUser } from "@/lib/user";
import { z } from "zod";

const Schema = z.object({
  action: z.string().nonempty(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const result = Schema.safeParse(await req.json());
    if (!result.success) throw new ArgumentError(result.error.message);
    const { action } = result.data;

    if (!action) throw new ArgumentError();
    if (user.role !== "admin") throw new PermissionError();

    if (action === "Stocks" || action === "All") {
      const count = await db.stock.deleteMany({
        where: {
          symbol: undefined,
        },
      });
      return NextResponse.json(count);
    }

    throw new ArgumentError();
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
