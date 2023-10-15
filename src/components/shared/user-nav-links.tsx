"use client";

import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Settings2,
  User,
} from "lucide-react";
import { SheetClose } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

interface Props {
  user: KindeUser;
  isAdmin?: boolean;
}

export default function UserNavLinks({ user, isAdmin }: Props) {
  const router = useRouter();

  const navLinks = [
    {
      label: "My Profile",
      href: `/u/${user.id}`,
      icon: <User className="w-5 h-5 mr-2 text-slate-400" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-2 text-slate-400" />,
    },
    {
      label: "My Portfolios",
      href: "/portfolio",
      icon: <ListOrdered className="w-5 h-5 mr-2 text-slate-400" />,
      separator: true,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell className="w-5 h-5 mr-2 text-slate-400" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-2 text-slate-400" />,
      separator: true,
    },
    {
      label: "Support",
      href: "/support",
      icon: <HelpCircle className="w-5 h-5 mr-2 text-slate-400" />,
    },
  ];

  return (
    <>
      {isAdmin && (
        <SheetClose className="w-full" asChild>
          <div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center w-full h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-100 dark:hover:bg-slate-900">
              <Settings2 className="w-5 h-5 mr-2 text-slate-400" />
              <h2 className="text-[15px]">Stock Control</h2>
            </button>
            <Separator className="my-2" />
          </div>
        </SheetClose>
      )}

      {navLinks.map((link) => (
        <SheetClose key={link.label} className="f-col w-full" asChild>
          <div>
            <button
              onClick={() => router.push(link.href)}
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-100 dark:hover:bg-slate-900 w-full">
              {link.icon}
              <h2 className="text-[15px]">{link.label}</h2>
            </button>
            {link.separator && <Separator className="my-2" />}
          </div>
        </SheetClose>
      ))}
    </>
  );
}
