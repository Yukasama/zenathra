import { getUser } from "@/lib/auth";
import React from "react";
import { UserAvatar } from "../../components/shared/user-avatar";

export default async function SettingsUserSection() {
  const user = await getUser();

  return (
    <div className="flex gap-4 items-center">
      <UserAvatar
        user={user}
        fallbackFontSize={20}
        className="h-12 w-12 border"
      />
      <div className="f-col">
        <h3 className="text-2xl font-medium">{`${user?.given_name} ${user?.family_name}`}</h3>
        <p className="text-zinc-500 text-sm">
          User Settings associated with your account
        </p>
      </div>
    </div>
  );
}
