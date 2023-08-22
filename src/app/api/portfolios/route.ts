import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArgumentError, PermissionError, ServerError } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    let session = null;
    try {
      session = await getSession();
      if (!session?.user || !session?.user.email) throw new PermissionError();
    } catch {
      throw new ServerError();
    }

    const portfolios = await db.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(portfolios);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}

const Schema = z.object({
  title: z.string().optional(),
  publicPortfolio: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let session = null;
    try {
      session = await getSession();
      if (!session?.user || !session?.user.email) throw new PermissionError();
    } catch {
      throw new ServerError();
    }

    const propsResult = Schema.safeParse(await req.json());
    if (!propsResult.success)
      throw new ArgumentError(propsResult.error.message);
    const { title = "Untitled", publicPortfolio = false } = propsResult.data;

    try {
      await db.portfolio.create({
        data: {
          title: title,
          userId: session.user.id,
          public: publicPortfolio,
        },
      });
    } catch {
      throw new ServerError("Portfolio could not be created.");
    }

    return NextResponse.json({ message: "Portfolio created successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
