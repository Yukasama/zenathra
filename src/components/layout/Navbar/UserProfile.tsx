"use client";

import { useEffect, useState } from "react";
import { ProfileIcon } from "@/components/ui/users";
import UserWindow from "@/components/layout/Navbar/UserWindow";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
  status: string;
}

export default function UserProfile({ session, status }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function handleClick(e: any) {
    if (
      !e.target.closest("#login-window") &&
      !e.target.closest("#login-button") &&
      !e.target.closest(".theme-toggle") &&
      !e.target.closest("#sidebar-toggle")
    ) {
      setCollapsed(false);
    }
  }

  return (
    <>
      <ProfileIcon
        image={session ? session.user.image : null}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <UserWindow session={session} status={status} collapsed={collapsed} />
    </>
  );
}
