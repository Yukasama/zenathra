"use client";

import Searchbar from "./searchbar";
import SidebarToggle from "./sidebar-toggle";
import { useSidebar } from "@/components/shared/sidebar-provider";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { Session } from "next-auth";
import { Card, CardContent, CardHeader } from "../ui/card";
import CompanyLogo from "./company-logo";

interface Props {
  session: Session | null;
}

export default function SidebarPortableClient({ session }: Props) {
  const { open, toggleSidebar } = useSidebar();

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(e: any) {
    if (e.target.closest(".hiding-sidebar") && !e.target.closest(".sidebar"))
      toggleSidebar();
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-screen bg-slate-100/50 opacity-0 transition-opacity duration-300 dark:bg-slate-950/50 ${
        open ? "opacity-100 z-30" : "-z-20"
      } hiding-sidebar`}>
      <Card
        className={`sidebar fixed ${
          open ? "translate-x-0" : "-translate-x-96"
        } h-screen duration-300 rounded-none z-30`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CompanyLogo px={35} />
              <p className="text-lg">Elysium</p>
            </div>
            <SidebarToggle>
              <X className="h-5" />
            </SidebarToggle>
          </div>
        </CardHeader>
        <CardContent>
          <Searchbar />
        </CardContent>
      </Card>
    </div>
  );
}
