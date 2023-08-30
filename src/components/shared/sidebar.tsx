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
import { Card } from "../ui/card";

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
    <Card className="rounded-none border-y-0 f-col p-3.5">
      <SidebarToggle>
        <MenuIcon className="h-[18px]" />
      </SidebarToggle>
    </Card>
  );
}
