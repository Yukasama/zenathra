import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotFoundResponse, UnauthorizedResponse } from "@/lib/response";
import { ModifySymbolsPortfolioSchema } from "@/lib/validators/portfolio";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { portfolioId, symbols } = ModifySymbolsPortfolioSchema.parse(
      await req.json()
    );

    let portfolio = await db.portfolio.findFirst({
      where: {
        id: portfolioId,
        creatorId: session.user.id,
      },
    });

    if (!portfolio)
      return new NotFoundResponse("Portfolio not found or not owned.");

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

      newSymbols = stocksInDatabase
        .map((stock) => stock.symbol)
        .filter((symbol) => !portfolio?.symbols.includes(symbol));
    } else {
      const stockInDatabase = await db.stock.findUnique({
        where: {
          symbol: symbols,
        },
      });

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
