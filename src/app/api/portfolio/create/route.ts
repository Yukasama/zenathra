import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";
import { z } from "zod";

const BASE_COLORS = [
  "#0088FE",
  "#00C49F",
  "#A463F2",
  "#20B2AA",
  "#7C4DFF",
];

function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * BASE_COLORS.length);
  return BASE_COLORS[randomIndex];
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { title, publicPortfolio, stockIds } = CreatePortfolioSchema.parse(
      await req.json()
    );

    const portfolios = await db.portfolio.findMany({
      select: { id: true },
      where: { creatorId: session.user.id },
    });

    const subscription = await db.userSubscription.findFirst({
      select: { id: true },
      where: {
        id: session.user.id,
        endDate: { gt: new Date() },
      },
    });

    if (portfolios.length > 1 && !subscription) return new ForbiddenResponse();

    const newPortfolio = await db.portfolio.create({
      data: {
        title: title,
        public: publicPortfolio,
        creatorId: session.user.id,
        color: getRandomColor(),
      },
    });

    if (stockIds && stockIds.length > 0) {
      await db.stockInPortfolio.createMany({
        data: stockIds.map((stockId) => ({
          portfolioId: newPortfolio.id,
          stockId: stockId,
        })),
      });
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
