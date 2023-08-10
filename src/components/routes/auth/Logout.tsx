"use client";

import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { FormEvent } from "react";
import { LogOut, SkipBack, X } from "react-feather";
import { Button } from "@/components/ui/buttons";
import { Checkbox } from "@/components/ui/inputs";

interface Props {
  setShow: any;
}

export default function Logout({ setShow }: Props) {
  const handleLogout = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    setShow(false);

    const loading = toast.loading("Logging out...");

    try {
      await signOut();
    } catch {
      toast.error("An error occurred during logout.", { id: loading });
    }
  };

  return (
    <div className="fcol">
      <Checkbox
        className="ml-1.5"
        heading="Remember Me"
        label="Keep me logged in on this device."
        onChange={() => {}}
      />
      <div className="pt-16 flex w-full justify-end gap-5">
        <Button
          onClick={() => setShow(false)}
          label="Cancel"
          color="blue"
          icon={<SkipBack className="h-4 w-4" />}
        />
        <Button
          onClick={handleLogout}
          label="Logout"
          color="red"
          icon={<LogOut className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
