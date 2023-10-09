"use client";

import { PropsWithChildren } from "react";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  LockIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();

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
    <div className="flex px-60 p-20 gap-10">
      <div className="f-col gap-0.5 min-w-[300px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-md flex gap-3 p-1.5 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 items-center ${
              pathname.split("/").pop() === tab.id &&
              "bg-slate-100 dark:bg-slate-800"
            }`}>
            {tab.icon}
            <p>{tab.label}</p>
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
