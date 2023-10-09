import { PropsWithChildren } from "react";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  LockIcon,
} from "lucide-react";
import { UserAvatar } from "@/components/user/user-avatar";
import SettingsItem from "@/components/settings-item";
import { getUser } from "@/lib/auth";

export default function Layout({ children }: PropsWithChildren) {
  const user = getUser();

  const tabs = [
    {
      id: "profile",
      label: "Personal Information",
      icon: <UserIcon className="text-slate-400 h-4 w-4" />,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Grid className="text-slate-400 h-4 w-4" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <LockIcon className="text-slate-400 h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <MessageCircle className="text-slate-400 h-4 w-4" />,
    },
    {
      id: "billing",
      label: "Billing Information",
      icon: <CreditCard className="text-slate-400 h-4 w-4" />,
    },
  ];

  return (
    <div className="f-col md:px-24 lg:px-52 xl:pl-80 xl:pr-60 p-12 gap-10">
      <div className="flex gap-4 items-center">
        <UserAvatar user={user!} className="h-14 w-14 border" />
        <div className="f-col">
          <h3 className="text-2xl font-extralight">{`${user?.given_name} ${user?.family_name}`}</h3>
          <p className="text-slate-500 text-sm">
            User Settings associated with your account
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div className="f-col gap-0.5 min-w-[300px]">
          {tabs.map((tab) => (
            <SettingsItem key={tab.id} {...tab} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
