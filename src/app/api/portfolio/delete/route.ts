import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { DeletePortfolioSchema } from "@/lib/validators/portfolio";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { portfolioId } = DeletePortfolioSchema.parse(await req.json());

    let portfolio = await db.portfolio.findFirst({
      where: {
        id: portfolioId,
        creatorId: session.user.id,
      },
    });

    if (!portfolio)
      return new UnauthorizedResponse("Portfolio not found or not owned");

    await db.portfolio.delete({
      where: {
        id: portfolioId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
