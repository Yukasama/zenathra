"use client";

import { signOut } from "next-auth/react";
import { FormEvent } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
      });
    }
  };

  return (
    <div className="f-col">
      <Checkbox className="ml-1.5">
        <h3>Remember Me</h3>
        <p>Keep me logged in on this device.</p>
      </Checkbox>
      <div className="pt-16 flex w-full justify-end gap-5">
        <Button onClick={() => setShow(false)}>
          <SkipBack className="h-4 w-4" />
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
