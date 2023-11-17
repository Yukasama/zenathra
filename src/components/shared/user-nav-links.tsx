"use client";

import {
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Settings2,
  User as UserIcon,
} from "lucide-react";
import { SheetClose } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { User } from "next-auth";

interface Props {
  user: User;
  isAdmin?: boolean;
}

export default function UserNavLinks({ user, isAdmin }: Props) {
  const router = useRouter();

  const navLinks = [
    {
      label: "My Profile",
      href: `/u/${user.id}`,
      icon: <UserIcon className="w-5 h-5 mr-2 text-zinc-400" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-2 text-zinc-400" />,
    },
    {
      label: "My Portfolios",
      href: "/portfolio",
      icon: <ListOrdered className="w-5 h-5 mr-2 text-zinc-400" />,
      separator: true,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-2 text-zinc-400" />,
      separator: true,
    },
  ];

  return (
    <>
      {isAdmin && (
        <SheetClose className="w-full" asChild>
          <div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center w-full h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <Settings2 className="w-5 h-5 mr-2 text-zinc-400" />
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
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 w-full">
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
