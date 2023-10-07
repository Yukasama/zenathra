"use client";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  Settings,
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
      label: "My Portfolios",
      href: "/u/portfolio",
      icon: <LayoutDashboard className="w-5 h-5 mr-2 text-slate-400" />,
      separator: true,
    },
    {
      label: "Notifications",
      href: "/u/settings",
      icon: <Bell className="w-5 h-5 mr-2 text-slate-400" />,
    },
    {
      label: "Settings",
      href: "/u/settings",
      icon: <Settings className="w-5 h-5 mr-2 text-slate-400" />,
      separator: true,
    },
    {
      label: "Support",
      href: "/u/settings",
      icon: <HelpCircle className="w-5 h-5 mr-2 text-slate-400" />,
    },
  ];

  return (
    <>
      {isAdmin && (
        <div>
          <SheetClose>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-800">
              <h2 className="text-[15px]">Stock Dashboard</h2>
            </button>
            <Separator className="my-2" />
          </SheetClose>
        </div>
      )}

      {navLinks.map((link) => (
        <SheetClose key={link.label} className="f-col w-full" asChild>
          <div>
            <button
              onClick={() => router.push(link.href)}
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-800 w-full">
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
