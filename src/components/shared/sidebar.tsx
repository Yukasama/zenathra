import SidebarItem from "./sidebar-item";
import { Menu } from "@/types/layout";
import {
  Home,
  BarChart2,
  Filter,
  BookOpen,
  Settings,
  LogIn,
  MenuIcon,
} from "lucide-react";
import SidebarToggle from "./sidebar-toggle";
import { getAuthSession } from "@/lib/auth";

export default async function Sidebar() {
  const session = await getAuthSession();

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
    <div className="w-[70px] h-full z-20 hidden md:flex flex-col justify-between bg-slate-200/60 transition-width dark:bg-moon-700 py-1.5 shadow-sm shadow-slate-300 dark:shadow-moon-100">
      <div className="f-col items-center justify-between h-full">
        <div className="f-col">
          <SidebarToggle className="m-1 mx-4 mb-2.5 flex items-center rounded-lg">
            <div className="p-3">
              <MenuIcon className="h-[22px]" />
            </div>
          </SidebarToggle>

          <div className="f-col">
            {menusUp.map((menu) => (
              <SidebarItem key={menu.title} {...menu} notext />
            ))}
          </div>
        </div>

        <div className="f-col">
          {menusDown.map((menu) => (
            <SidebarItem key={menu.title} {...menu} notext />
          ))}
        </div>
      </div>
    </div>
  );
}
