import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { ArgumentError, ConflictError, ServerError } from "@/lib/response";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(11, "Password must be atleast 11 characters."),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session) throw new ConflictError("User is already logged in.");

    const result = Schema.safeParse(await req.json());
    if (!result.success) throw new ArgumentError(result.error.message);
    const { email, password } = result.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictError("Email is already registered.");

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await db.user.create({
        data: {
          email,
          hashedPassword,
        },
      });
    } catch {
      throw new ServerError("ServerError: User could not be registered.");
    }

    return NextResponse.json({
      message: "User successfully registered.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
