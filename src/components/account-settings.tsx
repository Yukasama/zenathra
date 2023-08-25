"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  ChevronRight,
  Layers,
  Trash2,
  LockIcon,
} from "lucide-react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function AccountSettings({ session }: Props) {
  const [active, setActive] = useState("personal");

  const tabs = [
    {
      id: "personal",
      label: "Personal Information",
      icon: <UserIcon />,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Grid />,
    },
    {
      id: "security",
      label: "Security",
      icon: <LockIcon />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <MessageCircle />,
    },
    {
      id: "billing",
      label: "Billing Information",
      icon: <CreditCard />,
    },
  ];

  const personalInfo = [
    {
      title: "Picture",
      value: (
        <Image
          src={session?.user.image || "/images/unknown-user.png"}
          className="h-12 w-12 rounded-full border text-center"
          height={48}
          width={48}
          alt="Edit User Logo"
        />
      ),
      link: "/account/settings/edit/change-picture",
    },
    {
      title: "Name",
      value: <p className="flex-1 text-center">{session?.user.name || "Guest"}</p>,
      link: "/account/settings/edit/change-username",
    },
    {
      title: "E-Mail",
      value: <p className="flex-1 text-center">{session?.user.email}</p>,
      link: "/account/settings/edit/change-email",
    },
  ];

  const security = [
    {
      title: "Password",
      value: <p className="flex-1 text-center">***********</p>,
      link: "/account/settings/edit/change-password",
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-7">
      <div className="col-span-2 bg-slate-200/50 p-10 dark:bg-moon-400/30">
        <p className="mb-3 p-1 text-[30px] font-semibold">Settings</p>

        <div className="f-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`p-3 shadow-sm ${
                active === tab.id
                  ? "bg-blue-500"
                  : "hover:bg-slate-300/50 hover:dark:bg-moon-200"
              } flex gap-2 rounded-lg`}>
              <p className={`${active === tab.id && "text-white"}`}>
                {tab.icon}
              </p>
              <p className={`${active === tab.id && "text-white"}`}>
                {tab.label}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="col-span-5 f-col w-full items-center gap-8 p-32 py-20">
        {active === "personal" ? (
          <>
            <div className="f-col items-center gap-4">
              <Image
                className="h-20 w-20 rounded-full"
                src={session?.user.image || "/images/unknown-user.png"}
                height={80}
                width={80}
                alt="User Logo"
              />
              <div className="f-col items-center">
                <h2 className="text-3xl font-thin">Personal Information</h2>
                <p className="text-md font-thin text-slate-600">
                  Personal details linked to my account
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 rounded-lg border border-slate-300 p-3 px-5 dark:border-moon-100">
              <h2 className="p-3 text-xl font-light">General Information</h2>
              {personalInfo.map((info) => (
                <div className="f-col gap-2" key={info.title}>
                  <Link
                    href={info.link}
                    className="flex justify-between items-center w-full rounded-lg p-5 hover:bg-slate-200 dark:hover:bg-moon-200">
                    <p className="w-[50px] font-light text-slate-600">
                      {info.title}
                    </p>
                    {info.value}
                    <div className="f-box h-9 w-9 rounded-md ">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </Link>
                  {info.title !== "E-Mail" && (
                    <div className="mx-auto h-[1px] w-[97%] bg-slate-300 dark:bg-moon-100"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-5">
              <Button
                label="Export Data"
                icon={<Layers className="h-4 w-4" />}
                outline
              />
              <Button
                label="Delete Account"
                icon={<Trash2 className="h-4 w-4" />}
                color="red"
                outline
              />
            </div>
          </>
        ) : active === "portfolio" ? (
          <div className="mt-52 text-center text-3xl font-thin">
            Coming soon...
          </div>
        ) : active === "security" ? (
          <>
            <div className="f-col items-center gap-4">
              <Image
                className="h-20 w-20 rounded-full"
                src={session?.user.image || "/images/unknown-user.png"}
                height={80}
                width={80}
                alt="User Logo"
              />
              <div className="f-col items-center">
                <h2 className="text-3xl font-thin">Account Security</h2>
                <p className="text-md font-thin text-slate-600">
                  Security procedures linked to my account
                </p>
              </div>
            </div>

            <div className="f-col w-full gap-2 rounded-lg border border-slate-300 p-3 px-5 dark:border-moon-100">
              <h2 className="p-3 text-xl font-light">Authentication</h2>
              {security.map((info) => (
                <div className="f-col gap-2" key={info.title}>
                  <Link
                    href={info.link}
                    className="flex justify-between items-center w-full rounded-lg p-5 hover:bg-slate-200 dark:hover:bg-moon-200">
                    <p className="w-[50px] font-light text-slate-600">
                      {info.title}
                    </p>
                    {info.value}
                    <div className="f-box h-9 w-9 rounded-md ">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </Link>
                  {info.title !== "E-Mail" && (
                    <div className="mx-auto h-[1px] w-[97%] bg-slate-300 dark:bg-moon-100"></div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : active === "notifications" ? (
          <div className="mt-52 text-center text-3xl font-thin">
            Coming soon...
          </div>
        ) : (
          active === "billing" && (
            <div className="mt-52 text-center text-3xl font-thin">
              Coming soon...
            </div>
          )
        )}
      </div>
    </div>
  );
}
