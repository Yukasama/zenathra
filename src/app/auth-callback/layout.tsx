import { SITE } from "@/config/site";
import type { PropsWithChildren } from "react";

export const runtime = "edge";

export const metadata = {
  title: `${SITE.name} | Setting up...`,
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
