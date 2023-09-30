"use client";

import { Button } from "./ui/button";
import {
  UserIcon,
  Grid,
  MessageCircle,
  CreditCard,
  ChevronRight,
  Layers,
  Trash2,
  LockIcon,
  Undo2,
} from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import dynamic from "next/dynamic";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

// Dynamically importing forms to avoid client overload
const ChangeEmail = dynamic(() => import("./auth/change-email"), {
  ssr: false,
});

const ChangeUsername = dynamic(() => import("./auth/change-username"), {
  ssr: false,
});

interface Props {
  user: KindeUser;
}

export default function AccountSettings({ user }: Props) {
  const router = useRouter();

  const { mutate: sendResetMail, isLoading } = useMutation({
    mutationFn: async () => await axios.get("/api/user/send-reset-password"),
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Could not send reset password mail.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      toast({ description: "Password reset mail sent." });
    },
  });

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
            given_name: user.given_name,
            picture: user.picture,
          }}
          className="h-8 w-8"
        />
      ),
      form: <ChangeEmail />,
    },
    {
      title: "Name",
      value: user.given_name || null,
      form: <ChangeUsername />,
    },
    {
      title: "E-Mail",
      value: user.email || null,
      form: <ChangeEmail />,
    },
  ];

  return (
    <Tabs
      defaultValue="personal"
      className="flex f-col md:flex-row gap-4 h-full p-4">
      <Card className="md:pr-8 md:h-[600px]">
        <CardHeader className="hidden md:inline-block">
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <TabsList className="flex md:pt-[85px] md:f-col md:bg-transparent md:items-start gap-1 md:pl-3">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-md flex gap-3">
              {tab.icon}
              <p className="hidden md:inline-block">{tab.label}</p>
            </TabsTrigger>
          ))}
        </TabsList>
      </Card>
      <TabsContent value="personal" className="m-0">
        <Card className="border-none md:w-[450px]">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            {personal.map((section) => (
              <Sheet key={section.title}>
                <SheetTrigger className="h-20 flex items-center justify-between rounded-md w-full hover:bg-slate-100 dark:hover:bg-slate-900 px-3 gap-6">
                  <div className="w-[60px] text-start font-light text-slate-400">
                    {section.title}
                  </div>
                  <div className="w-[200px] text-start sm:max-w-[250px] truncate">
                    {section.value}
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </SheetTrigger>
                {section.title !== "E-Mail" && <Separator className="my-1" />}
                <SheetContent>{section.form}</SheetContent>
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
        <Card className="border-none md:w-[450px]">
          <CardHeader>
            <CardTitle>Portfolio Settings</CardTitle>
            <CardDescription>Manage your portfolio settings</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security" className="m-0">
        <Card className="border-none md:w-[450px]">
          <CardHeader>
            <CardTitle>Security Information</CardTitle>
            <CardDescription>Manage your security procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="h-20 flex items-center justify-between rounded-md w-full px-3 gap-6">
              <div className="w-[60px] text-start font-light text-slate-400">
                Password
              </div>
              <div className="w-[200px] text-center sm:max-w-[250px] truncate">
                *********
              </div>
              <Button
                variant="subtle"
                isLoading={isLoading}
                onClick={() => sendResetMail()}>
                <Undo2 className="h-4 w-4" />
                Reset
              </Button>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications" className="m-0">
        <Card className="border-none md:w-[450px]">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing" className="m-0">
        <Card className="border-none md:w-[450px]">
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
