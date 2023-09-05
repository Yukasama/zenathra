"use client";

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
import { Separator } from "./ui/separator";
import { UserAvatar } from "./shared/user-avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "recharts";
import { Input } from "./ui/input";

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

  const personal = [
    {
      title: "Picture",
      value: (
        <UserAvatar
          user={{
            name: session?.user.name || null,
            image: session?.user.image || null,
          }}
          className="h-8 w-8"
        />
      ),
      link: "/settings/edit/change-picture",
    },
    {
      title: "Name",
      value: session?.user.name || null,
      link: "/settings/edit/change-username",
    },
    {
      title: "E-Mail",
      value: session?.user.email || null,
      link: "/settings/edit/change-email",
    },
  ];

  const security = [
    {
      title: "Password",
      value: "*********",
      link: "/settings/edit/change-password",
    },
  ];

  return (
    <Tabs defaultValue="personal" className="flex gap-4 h-full p-4">
      <Card className="pr-8 h-[600px]">
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
      <TabsContent value="personal" className="m-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            {personal.map((section) => (
              <Sheet key={section.title}>
                <SheetTrigger className="h-20 flex items-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 px-3 gap-6">
                  <p className="w-[80px] font-light text-slate-400">
                    {section.title}
                  </p>
                  <div className="w-[200px] truncate">{section.value}</div>
                  <ChevronRight className="h-5 w-5" />
                </SheetTrigger>
                {section.title !== "E-Mail" && <Separator className="my-1" />}
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when youre
                      done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value="@peduarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="subtle">
              <Layers className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="portfolio" className="m-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Portfolio Settings</CardTitle>
            <CardDescription>Manage your portfolio settings</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security" className="m-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Security Information</CardTitle>
            <CardDescription>Manage your security procedures</CardDescription>
          </CardHeader>
          <CardContent>
            {security.map((section) => (
              <>
                <Link
                  key={section.title}
                  href={section.link}
                  className="h-20 flex items-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 px-3 gap-6">
                  <p className="w-[80px] font-light text-slate-400">
                    {section.title}
                  </p>
                  <div className="w-[200px] truncate">{section.value}</div>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                {section.title !== "E-Mail" && <Separator className="my-1" />}
              </>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications" className="m-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing" className="m-0">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your billing information</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
