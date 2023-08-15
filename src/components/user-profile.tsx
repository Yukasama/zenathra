"use client";

import { useEffect, useState } from "react";
import { ProfileIcon, UserWindow } from "@/components";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function UserProfile({ session }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function handleClick(e: any) {
    if (!e.target.closest(".essential")) setCollapsed(false);
  }

  return (
    <>
      <ProfileIcon
        image={session?.user.image}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <UserWindow session={session} collapsed={collapsed} />
    </>
  );
}
