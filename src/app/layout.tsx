import {
  Footer,
  Navbar,
  Sidebar,
  Provider,
  SidebarPortable,
} from "@/components/shared";
import "@/styles/globals.css";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { site } from "@/config/site";

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
      <body>
        <Provider>
          <div className="h-screen w-screen flex overflow-hidden bg-slate-100 dark:bg-moon-300">
            <Sidebar />
            <SidebarPortable />
            <div className="w-full overflow-auto">
              {authModal}
              <Navbar />
              <main className="min-h-full">{children}</main>
              <Footer />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
