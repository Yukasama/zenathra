import { db } from "@/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import PortfolioImage from "../portfolio-image";
import Link from "next/link";

interface Props {
  user: KindeUser;
}

export default async function PortfolioList({ user }: Props) {
  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      public: true,
      color: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { creatorId: user.id },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolios</CardTitle>
        <CardDescription>List of all portfolios</CardDescription>
      </CardHeader>
      <CardContent>
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/p/${portfolio.id}`}>
            <Card className="p-2 h-12 flex items-center w-full hover:bg-slate-900">
              <div className="flex items-center gap-2">
                <PortfolioImage portfolio={portfolio} px={35} />
                <div>
                  <p className="text-sm">{portfolio.title}</p>
                  <p className="text-[12px] text-slate-500">
                    Created on {portfolio.createdAt.toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
