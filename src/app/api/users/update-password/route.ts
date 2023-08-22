import { db } from "@/lib/db";
import { ArgumentError, PermissionError, ServerError } from "@/lib/response";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";

const Schema = z.object({
  action: z.enum(["email", "username", "password"]),
});

const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const PasswordSchema = z.object({
  oldPassword: z.string().min(1, "Please enter a valid password."),
  password: z.string().min(11, "Password must contain 11 or more characters."),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const parsed = Schema.safeParse(await req.json());
    if (!parsed.success) throw new ArgumentError(parsed.error.message);
    const { action } = parsed.data;

    const databaseUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!databaseUser) throw new ServerError("User not found.");

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    if (accounts.length > 0)
      throw new PermissionError(
        "Change not possible since you have multiple linked accounts to your mail."
      );

    if (action === "password") {
      const parsedPassword = PasswordSchema.safeParse(await req.json());
      if (!parsedPassword.success)
        throw new ArgumentError(parsedPassword.error.message);
      const { oldPassword, password } = parsedPassword.data;

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
    }

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
