import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ArgumentError } from "@/lib/response";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    userId: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { userId } = result.data.params;

    const user = await db.user.findUnique({
      select: {
        name: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user) throw new ArgumentError("User not found.");

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
