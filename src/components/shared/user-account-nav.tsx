import Link from "next/link";
import { Separator } from "../ui/separator";
import { UserAvatar } from "@/components/user/user-avatar";
import {
  type KindeUser,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface Props {
  user: KindeUser;
  isAdmin?: boolean;
}

export function UserAccountNav({ user, isAdmin }: Props) {
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
    <Sheet>
      <SheetTrigger>
        <UserAvatar user={user} className="h-8 w-8" />
      </SheetTrigger>
      <SheetContent>
        <div className="flex items-center justify-start gap-2 p-2 mb-1">
          <UserAvatar user={user} className="h-8 w-8" />
          <div className="flex flex-col space-y-1 leading-none">
            {user.given_name && (
              <p className="font-medium">{user.given_name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {isAdmin && (
          <>
            <Link
              href="/admin/dashboard"
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-800">
              <h2 className="text-[15px]">Stock Dashboard</h2>
            </Link>
            <Separator className="my-2" />
          </>
        )}

        {navLinks.map((link) => (
          <>
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center h-9 p-1 mb-[1px] rounded-md px-4 hover:bg-slate-800">
              {link.icon}
              <h2 className="text-[15px]">{link.label}</h2>
            </Link>
            {link.separator && <Separator className="my-2" />}
          </>
        ))}

        <Separator className="my-2" />

        <LogoutLink className="flex items-center h-9 p-1 rounded-md px-4 hover:bg-slate-800">
          <LogOut className="w-5 h-5 mr-2 text-slate-400" />
          <h2 className="text-[15px]">Sign Out</h2>
        </LogoutLink>
      </SheetContent>
    </Sheet>
  );
}
