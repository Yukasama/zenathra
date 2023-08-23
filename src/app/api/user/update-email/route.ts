import { db } from "@/lib/db";
import { ArgumentError, PermissionError, ServerError } from "@/lib/response";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const Schema = z.object({
  email: z.string().email("Invalid email address."),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) throw new ArgumentError(parsed.error.message);
    const { email } = parsed.data;

    if (await db.user.findUnique({ where: { email } }))
      throw new ArgumentError("Email is already registered.");

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    if (accounts.length > 0)
      throw new PermissionError(
        "Email change not possible since you have linked accounts to your mail."
      );

    try {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: email,
        },
      });
    } catch {
      throw new ServerError("Email could not be changed.");
    }

    return NextResponse.json({ message: "Email changed successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
