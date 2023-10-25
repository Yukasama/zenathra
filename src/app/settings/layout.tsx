import { PropsWithChildren } from "react";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  LockIcon,
  Settings2,
} from "lucide-react";
import SettingsItem from "@/app/settings/settings-item";
import SettingsUserSection from "@/app/settings/settings-user-section";

export default function Layout({ children }: PropsWithChildren) {
  const tabs = [
    {
      id: "profile",
      label: "Public Profile",
      icon: <UserIcon className="text-slate-400 h-4 w-4" />,
    },
    {
      id: "account",
      label: "Account",
      icon: <Settings2 className="text-slate-400 h-4 w-4" />,
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
    <div className="f-col px-6 md:pl-20 md:pr-14 lg:pl-32 lg:pr-28 xl:pl-64 xl:pr-56 p-8 sm:p-12 gap-7 sm:gap-10">
      <SettingsUserSection />
      <div className="f-col sm:flex-row gap-10 md:gap-16">
        <div className="f-col gap-0.5 min-w-full sm:min-w-[250px] lg:min-w-[300px]">
          {tabs.map((tab) => (
            <SettingsItem key={tab.id} {...tab} />
          ))}
        </div>
        <div className="flex px-4 p-2 flex-1">{children}</div>S
      </div>
    </div>
  );
}
