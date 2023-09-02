"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
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
import type { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import PageLayout from "./page-layout";
import { Separator } from "./ui/separator";

interface Props {
  session: Session | null;
}

export default function AccountSettings({ session }: Props) {
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
      value: (
        <p className="flex-1 text-center">{session?.user.name || "Guest"}</p>
      ),
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
    <PageLayout>
      <Tabs defaultValue="personal" className="flex gap-5">
        <Card className="pr-8">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <TabsList className="f-col bg-transparent f-col items-start gap-1 pl-3">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-md flex gap-3">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {personalInfo.map((info) => (
                <>
                  <Link
                    key={info.title}
                    href={info.link}
                    className="h-20 flex justify-between items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 px-3">
                    <p className="w-[50px] font-light text-slate-400">
                      {info.title}
                    </p>
                    {info.value}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  {info.title !== "E-Mail" && <Separator className="my-1" />}
                </>
              ))}
            </CardContent>
            <CardFooter>
              <div className="mt-2 flex gap-5">
                <Button variant="subtle">
                  <Layers className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio">
          <div className="mt-52 text-center text-3xl font-thin">
            Coming soon...
          </div>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            {security.map((info) => (
              <>
                <Link
                  key={info.title}
                  href={info.link}
                  className="h-20 flex justify-between items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 px-3">
                  <p className="w-[50px] font-light text-slate-400">
                    {info.title}
                  </p>
                  {info.value}
                  <ChevronRight className="h-5 w-5" />
                </Link>
                {info.title !== "E-Mail" && <Separator className="my-1" />}
              </>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="mt-52 text-center text-3xl font-thin">
            Coming soon...
          </div>
        </TabsContent>
        <TabsContent value="billing">
          <div className="mt-52 text-center text-3xl font-thin">
            Coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
