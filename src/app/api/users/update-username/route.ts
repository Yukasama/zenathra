import db from "@/lib/db";
import { ArgumentError, PermissionError, ServerError } from "@/lib/errors";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const Schema = z.object({
  username: z.string().min(1, "Please enter a valid name."),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) throw new ArgumentError(parsed.error.message);
    const { username } = parsed.data;

    try {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: username,
        },
      });
    } catch {
      throw new ServerError("Username could not be changed.");
    }

    return NextResponse.json({ message: "Username changed successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
