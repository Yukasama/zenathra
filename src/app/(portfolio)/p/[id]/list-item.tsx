"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  link: string;
  icon: React.ReactNode;
  portfolioId: string;
}

export default function ListItem({ title, link, icon, portfolioId }: Props) {
  const pathname = usePathname();

  return (
    <Link href={`/p/${portfolioId}/${link === portfolioId ? "" : link}`}>
      <Card
        className={`${
          pathname.split("/").pop() === link ? "bg-primary text-white"
        : "hover:bg-primary/20"} lg:w-60`}>
        <div className="flex items-center gap-3 px-3 lg:px-4 p-1.5">
          {icon}
          <p className="hidden lg:flex">{title}</p>
        </div>
      </Card>
    </Link>
  );
}
