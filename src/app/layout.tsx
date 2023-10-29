import Provider from "@/components/shared/provider";
import type { Metadata } from "next";
import { cn, constructMetadata } from "@/lib/utils";
import { K2D } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import type { PropsWithChildren } from "react";
import dynamic from "next/dynamic";
import "./globals.css";

const Navbar = dynamic(() => import("@/components/shared/navbar"));
const Footer = dynamic(() => import("@/components/shared/footer"));

const k2d = K2D({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased min-h-screen overflow-hidden",
          k2d.className
        )}>
        <Provider>
          <div className="h-screen overflow-auto">
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
