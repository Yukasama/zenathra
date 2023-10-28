"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { notFound } from "next/navigation";
import Skeleton from "@/components/ui/skeleton";

interface Props {
  id: string;
  createdAt: string;
}

export default function UserOverview({ id, createdAt }: Props) {
  const { data: user, isFetched } = trpc.user.getbyId.useQuery(id);

  if (isFetched && !user) return notFound();

  return (
    <Skeleton isLoaded={isFetched}>
      <div className="relative">
        <div className="bg-gradient-to-br from-primary to-secondary h-24 lg:h-40"></div>
        <UserAvatar
          user={user}
          fallbackFontSize={48}
          className="h-24 w-24 lg:w-48 lg:h-48 border absolute top-12 left-12 lg:top-16 lg:left-20"
        />
        <Card className="border-x-0 rounded-t-none px-7 pt-8 lg:pt-0 lg:pl-80 lg:pr-40">
          <CardHeader>
            <div className="flex justify-between">
              <div className="f-col gap-1">
                <CardTitle className="text-2xl lg:text-3xl font-medium">
                  {`${user?.given_name} ${user?.family_name}`}
                </CardTitle>
                <div className="text-zinc-500 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <p className="text-zinc-600">Joined on {createdAt}</p>
                </div>
              </div>
              <Link
                href="/settings/profile"
                className={buttonVariants({
                  variant: "subtle",
                })}>
                Edit Profile
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </Skeleton>
  );
}
