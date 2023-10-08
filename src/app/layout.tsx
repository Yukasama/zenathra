import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import Provider from "@/components/shared/provider";
import { Metadata } from "next";
import { cn, constructMetadata } from "@/lib/utils";
import { K2D } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { PropsWithChildren } from "react";

import "./globals.css";

const k2d = K2D({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600"] });

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
            {/* @ts-expect-error Server Component */}
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
