import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { ModifySymbolsPortfolioSchema } from "@/lib/validators/portfolio";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { portfolioId, stockIds } = ModifySymbolsPortfolioSchema.parse(
      await req.json()
    );

    let portfolio = await db.portfolio.findFirst({
      select: { id: true },
      where: {
        id: portfolioId,
        creatorId: session.user.id,
      },
    });

    if (!portfolio)
      return new NotFoundResponse("Portfolio not found or not owned");

    await db.stockInPortfolio.deleteMany({
      where: {
        portfolioId: portfolioId,
        stockId: {
          in: stockIds,
        },
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
