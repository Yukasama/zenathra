import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import SidebarPortable from "@/components/shared/sidebar-portable";
import Provider from "@/components/shared/provider";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { K2D } from "next/font/google";
import { site } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import { PropsWithChildren } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: "/favicon.ico" },
  keywords: site.keywords,
  creator: site.creator,
};

const k2d = K2D({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn("text-slate-900 antialiased light", k2d.className)}
      suppressHydrationWarning>
      <body>
        <Provider>
          <div className="w-screen h-screen flex overflow-hidden">
            {/* @ts-expect-error Server Component */}
            <Sidebar />
            {/* @ts-expect-error Server Component */}
            <SidebarPortable />
            <div className="w-full overflow-auto">
              {/* @ts-expect-error Server Component */}
              <Navbar />
              <main className="min-h-full">{children}</main>
              <Footer />
            </div>
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
