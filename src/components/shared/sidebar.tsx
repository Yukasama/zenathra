import { db } from "@/db";
import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Sidebar() {
  const user = getUser();

  const portfolios =
    user &&
    (await db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        color: true,
      },
      where: { creatorId: user?.id ?? undefined },
      orderBy: { title: "asc" },
    }));

  return (
    <div className="fixed h-screen top-16 hidden border-r md:f-col w-16 p-3.5 gap-4">
      {portfolios?.map((portfolio) => (
        <Link
          href={`/p/${portfolio.id}`}
          key={portfolio.id}
          className="rounded-full border h-10 w-10 f-box hover:bg-slate-100 dark:hover:bg-slate-900"
          style={{
            backgroundColor: portfolio.color || "#000",
          }}>
          <p className="font-medium text-white text-lg">
            {portfolio.title[0].toUpperCase()}
          </p>
        </Link>
      ))}
    </div>
  );
}
