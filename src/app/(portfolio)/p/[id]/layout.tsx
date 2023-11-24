import PageLayout from "@/components/shared/page-layout";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  ExternalLink,
  EyeOff,
  LayoutDashboard,
  PieChart,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import ListItem from "./list-item";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { SkeletonButton, SkeletonInput } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const ChangeTitle = dynamic(
  () => import("@/app/(portfolio)/p/[id]/change-title"),
  {
    ssr: false,
    loading: () => <SkeletonInput />,
  }
);

const EditVisibility = dynamic(
  () => import("@/components/portfolio/edit-visibility"),
  {
    ssr: false,
    loading: () => <SkeletonButton />,
  }
);

const PortfolioAddModal = dynamic(
  () => import("@/components/portfolio/portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton />,
  }
);

interface Props extends PropsWithChildren {
  params: { id: string };
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      title: true,
      isPublic: true,
      creatorId: true,
    },
    where: { id },
  });

  if (!portfolio) {
    return { title: "Portfolio not found" };
  }

  const user = await getUser();

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.creatorId) {
    return { title: "This portfolio is private" };
  }

  return { title: portfolio.title };
}

export default async function Layout({ children, params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      title: true,
      isPublic: true,
      creatorId: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { id },
  });

  if (!portfolio) {
    return notFound();
  }

  const user = await getUser();

  // Portfolio is private and it does not belong to the user
  if (!portfolio.isPublic && user?.id !== portfolio.creatorId) {
    return (
      <div className="f-box f-col mt-[376px] gap-3">
        <div className="p-5 mb-0.5 rounded-full w-20 h-12 f-box bg-primary">
          <EyeOff className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-medium">This Portfolio is private.</h2>

        <Link
          href="/"
          className="text-zinc-400 flex items-center gap-2 hover:underline">
          Back to homepage
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const PORTFOLIO_LINKS = [
    {
      title: "Overview",
      link: id,
      icon: <LayoutDashboard />,
    },
    {
      title: "Performance",
      link: "performance",
      icon: <BarChart2 />,
    },
    {
      title: "Statistics",
      link: "statistics",
      icon: <PieChart />,
    },
  ];

  return (
    <PageLayout className="f-col lg:flex-row gap-8">
      {/* Navigator */}
      <Card className="border-none bg-zinc-50 dark:bg-zinc-900/70 flex justify-evenly lg:f-col lg:justify-start p-4 lg:p-8 lg:py-10 gap-3.5">
        {PORTFOLIO_LINKS.map((link) => (
          <ListItem key={link.title} portfolioId={id} {...link} />
        ))}
      </Card>

      {/* Header */}
      <div className="f-col flex-1 gap-4">
        <div className="flex items-center justify-between px-2">
          {/* Title */}
          <div>
            <CardTitle className="text-2xl">
              {user?.id === portfolio.creatorId ? (
                <ChangeTitle portfolio={portfolio} />
              ) : (
                portfolio.title
              )}
            </CardTitle>
            <CardDescription className="mr-3">
              Created on{" "}
              {portfolio.createdAt.toISOString().split(".")[0].split("T")[0]}
            </CardDescription>
          </div>

          {/* Visibility */}
          {user?.id === portfolio.creatorId && (
            <div className="w-28">
              <EditVisibility portfolio={portfolio} />
            </div>
          )}
        </div>

        <Separator />

        {/* Dashboard */}
        {portfolio.stocks.length ? (
          children
        ) : (
          <div className="f-box f-col gap-3 mt-80">
            <h2 className="font-medium text-lg">
              There are no stocks in this portfolio.
            </h2>
            {user?.id === portfolio.creatorId && (
              <PortfolioAddModal portfolio={portfolio} />
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
