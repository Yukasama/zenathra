"use client";

import {
  BookOpen,
  BarChart2,
  Home,
  Filter,
  Settings,
  LogIn,
  Menu as MenuIcon,
} from "react-feather";
import Sidelink from "@/components/layout/Sidebar/Sidelink";
import { Menu } from "@/types/layout";
import { useSession } from "next-auth/react";
import { useSidebar } from "../providers/SidebarProvider";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const { toggleSidebar } = useSidebar();

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
          to: "/auth/signin",
          icon: <LogIn className="h-[22px]" />,
        },
  ];

  return (
    <div className="w-[70px] h-full z-20 hidden md:flex flex-col justify-between bg-gray-200/60 transition-width dark:bg-moon-700 py-1.5 shadow-sm shadow-gray-300 dark:shadow-moon-100">
      <div className="f-col items-center justify-between h-full">
        <div className="f-col">
          <button
            onClick={() => toggleSidebar()}
            className="m-1 mx-4 mb-2.5 flex items-center rounded-lg">
            <div className="p-3">
              <MenuIcon className="h-[22px]" />
            </div>
          </button>

          <div className="f-col">
            {menusUp.map((menu) => (
              <Sidelink key={menu.title} {...menu} notext />
            ))}
          </div>
        </div>

        <div className="f-col">
          {menusDown.map((menu) => (
            <Sidelink
              key={menu.title}
              {...menu}
              loading={status === "loading"}
              notext
            />
          ))}
        </div>
      </div>
    </div>
  );
}
