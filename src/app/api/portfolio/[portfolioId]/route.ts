import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UnauthorizedResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    portfolioId: z.string().nonempty(),
  }),
});

const PostSchema = z.object({
  symbols: z.union([z.string().nonempty(), z.array(z.string().nonempty())]),
  operation: z.enum(["add", "remove"]),
});

const PostParamsSchema = z.object({
  params: z.object({
    portfolioId: z.string(),
  }),
});

export async function POST(req: NextRequest, rawParams: unknown) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const paramsResult = PostParamsSchema.safeParse(rawParams);
    if (!paramsResult.success)
      throw new ArgumentError(paramsResult.error.message);
    const { portfolioId } = paramsResult.data.params;

    const propsResult = PostSchema.safeParse(await req.json());
    if (!propsResult.success)
      throw new ArgumentError(propsResult.error.message);
    const { symbols, operation } = propsResult.data;

    if (!symbols.length || !operation) throw new ArgumentError();

    let portfolio = await db.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId: session.user.id,
      },
    });

    if (!portfolio)
      throw new NotFoundError("Portfolio not found or not owned.");

    let newSymbols: string[] = [];

    if (Array.isArray(symbols)) {
      const stocksInDatabase = await db.stock.findMany({
        select: {
          symbol: true,
        },
        where: {
          symbol: {
            in: symbols,
          },
        },
      });

      if (operation === "add") {
        newSymbols = stocksInDatabase
          .map((stock) => stock.symbol)
          .filter((symbol) => !portfolio?.symbols.includes(symbol));
      } else if (operation === "remove") {
        newSymbols = portfolio.symbols.filter(
          (symbol) => !symbols.includes(symbol)
        );
      }
    } else {
      const stockInDatabase = await db.stock.findUnique({
        where: {
          symbol: symbols,
        },
      });

      if (!stockInDatabase)
        throw new NotFoundError("Symbol not found in database.");

      if (operation === "add") {
        newSymbols = [...portfolio.symbols, symbols];
      } else if (operation === "remove") {
        newSymbols = portfolio.symbols.filter(
          (symbol) => !symbols.includes(symbol)
        );
      }
    }

    try {
      await db.portfolio.update({
        where: {
          id: portfolioId,
        },
        data: {
          symbols: newSymbols,
        },
      });
    } catch {
      throw new ServerError(
        `An error occured during ${
          operation === "add" ? "adding stocks to" : "removing stocks from"
        } portfolio.`
      );
    }

    return NextResponse.json({
      message: `Stocks successfully ${
        operation === "add" ? "added to" : "removed from"
      } portfolio.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, rawParams: unknown) {
  try {
    let session = null;
    try {
      session = await getSession();
      if (!session?.user || !session?.user.email) throw new PermissionError();

      const result = Schema.safeParse(rawParams);
      if (!result.success) throw new ArgumentError(result.error.message);
      const { portfolioId } = result.data.params;

      await db.portfolio.delete({
        where: {
          id: portfolioId,
        },
      });
    } catch {
      throw new ServerError("An error occured while deleting portfolio.");
    }

    return NextResponse.json({
      message: "Portfolio successfully deleted.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
