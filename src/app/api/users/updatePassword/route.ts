import db from "@/lib/db";
import { ArgumentError, PermissionError, ServerError } from "@/lib/errors";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";

const Schema = z.object({
  oldPassword: z.string().min(1, "Please enter a valid password."),
  password: z.string().min(11, "Password must contain 11 or more characters."),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) throw new ArgumentError(parsed.error.message);
    const { oldPassword, password } = parsed.data;

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    if (accounts.length > 0)
      throw new PermissionError(
        "Password change not possible since your auth provider determines the password."
      );

    const databaseUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!databaseUser) throw new ServerError("User not found.");

    if (!(await bcrypt.compare(oldPassword, databaseUser.hashedPassword)))
      throw new ArgumentError("Invalid password.");

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword: hashedPassword,
        },
      });
    } catch {
      throw new ServerError("Password could not be changed.");
    }

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
