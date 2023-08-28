"use client";

import { signOut } from "next-auth/react";
import { FormEvent } from "react";
import { Button, Checkbox } from "@/components/ui";
import { toast } from "@/hooks/use-toast";
import { LogOut, SkipBack } from "lucide-react";

interface Props {
  setShow: any;
}

export default function LogoutWindow({ setShow }: Props) {
  const handleLogout = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    setShow(false);

    try {
      await signOut();
    } catch {
      toast({
        title: "Oops! Something went wrong.",
        description: "Please try again later.",
      })
    }
  };

  return (
    <div className="f-col">
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
