import SidebarToggle from "./sidebar-toggle";
import { Card } from "../ui/card";
import { Menu } from "lucide-react";
import { db } from "@/db";
import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Sidebar() {
  const user = getUser();

  const portfolios = await db.portfolio.findMany({
    where: { creatorId: user?.id ?? undefined },
    orderBy: { title: "asc" },
  });

  return (
    <Card className="hidden md:flex rounded-none border-y-0 f-col p-3.5 gap-4">
      <SidebarToggle>
        <Menu className="h-[18px]" />
      </SidebarToggle>

      {user &&
        portfolios.map((portfolio) => (
          <Link
            href={`/p/${portfolio.id}`}
            key={portfolio.id}
            className="rounded-full border h-10 w-10 f-box hover:bg-slate-100 dark:hover:bg-slate-900"
            style={{
              backgroundColor: portfolio.color || "#000",
            }}>
            <p className="font-medium text-lg">
              {portfolio.title[0].toUpperCase()}
            </p>
          </Link>
        ))}
    </Card>
  );
}
