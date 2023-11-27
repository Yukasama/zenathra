import PageLayout from "@/components/shared/page-layout";
import type { PropsWithChildren } from "react";

export const metadata = { title: "Stock Screener" };
// export const runtime = "edge";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PageLayout className="flex f-col gap-5 lg:flex-row">{children}</PageLayout>
  );
}
