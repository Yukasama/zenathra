import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import SidebarPortable from "@/components/shared/sidebar-portable";
import Provider from "@/components/shared/provider";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { site } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: "/images/favicon.ico",
  },
  keywords: site.keywords,
  creator: "Yukasama",
};

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
  authModal: React.ReactNode;
}

export default async function RootLayout({ children, authModal }: Props) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
      suppressHydrationWarning>
      <body className="h-screen w-screen flex overflow-hidden bg-slate-100 dark:bg-moon-300">
        <Provider>
          <Sidebar />
          <SidebarPortable />
          <div className="w-full overflow-auto">
            {authModal}
            <Navbar />
            <main className="min-h-full">{children}</main>
            <Footer />
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
