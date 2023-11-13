import PageLayout from "@/components/shared/page-layout";
import { SITE } from "@/config/site";
import type { PropsWithChildren } from "react";

export const runtime = "edge";

export const metadata = {
  title: `${SITE.name} | Stock Screener`,
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PageLayout className="flex f-col gap-5 lg:flex-row">{children}</PageLayout>
  );
}
