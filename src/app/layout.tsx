import { Footer, Navbar, Sidebar, Provider } from "@/components/layout";
import PortableSidebar from "@/components/layout/Sidebar/PortableSidebar";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elysium",
  description: "Elysium - The Stock Market Tool.",
  icons: {
    icon: "/images/favicon.ico",
  },
  keywords: [
    "stocks",
    "stock market",
    "stock market tool",
    "stock market app",
    "stock market website",
  ],
  creator: "Yukasama",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <div className="h-screen w-screen flex overflow-hidden bg-gray-100 dark:bg-moon-300">
            <Sidebar />
            <PortableSidebar />
            <div className="w-full overflow-auto">
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
