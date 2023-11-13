import type { PropsWithChildren } from "react";

export const metadata = { title: "Setting up..." };
export const runtime = "edge";

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
