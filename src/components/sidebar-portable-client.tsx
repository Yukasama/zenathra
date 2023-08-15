"use client";

import {
  BookOpen,
  BarChart2,
  Home,
  Filter,
  Settings,
  LogIn,
  X,
} from "react-feather";
import { SidebarItem, Searchbar, SidebarToggle } from "@/components";
import { Menu } from "@/types/layout";
import { useSidebar } from "@/components/sidebar-provider";
import { useEffect } from "react";
import Image from "next/image";
import { Session } from "next-auth";

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

  const menusUp: Menu[] = [
    {
      title: "Home",
      to: "/",
      icon: <Home className="h-[22px]" />,
    },
    {
      title: "Portfolio",
      to: "/account/portfolio",
      icon: <BarChart2 className="h-[22px]" />,
      gap: true,
    },
    {
      title: "Screener",
      to: "/screener",
      icon: <Filter className="h-[22px]" />,
      gap: true,
    },
    {
      title: "Education",
      to: "/education",
      icon: <BookOpen className="h-[22px]" />,
    },
  ];

  const menusDown: Menu[] = [
    session
      ? {
          title: "Settings",
          to: "/account/settings",
          icon: <Settings className="h-[22px]" />,
        }
      : {
          title: "Login",
          to: "/auth/sign-in",
          icon: <LogIn className="h-[22px]" />,
        },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-screen bg-slate-100/50 opacity-0 transition-opacity duration-300 dark:bg-moon-300/50 ${
        open ? "opacity-100 z-30" : "-z-20"
      } hiding-sidebar`}>
      <div
        className={`sidebar fixed w-80 ${
          open ? "translate-x-0" : "-translate-x-96"
        } f-col h-full justify-between bg-slate-200 py-3 shadow-sm shadow-moon-100 duration-300 dark:bg-moon-700`}>
        <div className="f-col h-full w-full items-center justify-between">
          <div className="f-col w-full gap-4">
            <div className="flex w-full items-center justify-between px-3 pl-7">
              <div className="flex items-center gap-3">
                <Image
                  className="rounded-md"
                  src="/images/logo/logo.png"
                  width={40}
                  height={40}
                  alt="Company Logo"
                />
                <p className="text-lg font-light">Elysium</p>
              </div>
              <SidebarToggle className="right-2 top-2 p-3">
                <X className="h-[22px]" />
              </SidebarToggle>
            </div>
            <div className="m-auto w-[90%]">
              <Searchbar placeholder="Search Stocks..." />
            </div>

            <div className="f-col w-full">
              {menusUp.map((menu) => (
                <SidebarItem
                  key={`${menu.title}-portable`}
                  onClick={toggleSidebar}
                  {...menu}
                />
              ))}
            </div>
          </div>

          <div className="f-col w-full">
            {menusDown.map((menu) => (
              <SidebarItem
                key={`${menu.title}-portable`}
                onClick={toggleSidebar}
                {...menu}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
