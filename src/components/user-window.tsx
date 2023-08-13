"use client";

import { LogIn, Send, LogOut, Globe } from "react-feather";
import Image from "next/image";
import { useState } from "react";
import { LogoutWindow } from "@/components";
import Link from "next/link";
import { Session } from "next-auth";
import { Modal } from "@/components/ui";

interface Props {
  session: Session | null;
  status: string;
  collapsed: boolean;
}

export default function UserWindow({ session, status, collapsed }: Props) {
  const [logoutShow, setLogoutShow] = useState(false);

  return (
    <>
      <div
        className={`essential ${
          !collapsed && "hidden"
        } fixed right-3 lg:right-5 top-[65px] flex h-[350px] w-[250px] flex-col 
        items-center gap-3 rounded-lg box p-3 ${
          status === "loading" && "animate-pulse-right"
        }`}>
        {status !== "loading" && (
          <div className="f-col h-full w-full items-center justify-between">
            <div className="f-col w-full items-center gap-1">
              <div
                className="flex h-[60px] w-full items-center rounded-md
              bg-slate-200 dark:bg-moon-500">
                <Link href={`/users/${session ? session.user.id : null}`}>
                  <Image
                    className="m-4 rounded-full"
                    referrerPolicy="no-referrer"
                    src={
                      session
                        ? session.user.image ?? "/images/unknown-user.png"
                        : "/images/unknown-user.png"
                    }
                    width={45}
                    height={45}
                    alt="User Logo"
                    loading="lazy"
                  />
                </Link>
                <div className="f-col">
                  <p className="w-[130px] truncate text-[14px] font-medium">
                    {session && session.user.name
                      ? session.user.name
                      : session && session.user.email
                      ? session.user.email
                          .split("@")[0]
                          .charAt(0)
                          .toUpperCase() +
                        session.user.email.split("@")[0].slice(1).toLowerCase()
                      : "Guest"}
                  </p>
                  {session && (
                    <Link
                      href="/account/settings"
                      className={`${
                        !session && "hidden"
                      } text-[13px] text-blue-500`}>
                      Manage Account
                    </Link>
                  )}
                </div>
              </div>
              <div className="line my-1 h-full w-full"></div>
              <div className="z-5 f-col gap-2.5 w-full items-center">
                {!session && (
                  <div className="w-full f-col items-center">
                    <Link
                      href="/auth/signin"
                      className="flex h-[40px] w-full items-center rounded-md bg-slate-300/50 hover:bg-slate-300 dark:bg-moon-200 dark:hover:bg-moon-300">
                      <LogIn className="mx-4 mr-3 h-4 text-white" />
                      <p className="text-[14px] font-medium text-white">
                        Sign In
                      </p>
                    </Link>
                    <div className="my-0.5 flex items-center gap-2">
                      <div className="line w-[50px]"></div>
                      <p className="text-[12px] text-slate-400 dark:text-moon-100">
                        OR
                      </p>
                      <div className="line w-[50px]"></div>
                    </div>
                    <Link
                      href="/auth/register"
                      className="flex items-center w-full h-[40px] rounded-md bg-blue-500 hover:bg-blue-600">
                      <Send className="mx-4 mr-3 h-4" />
                      <p className="text-[14px] font-medium text-white">
                        Sign Up
                      </p>
                    </Link>
                    <div className="line my-3 w-full"></div>
                  </div>
                )}
                <button
                  className="flex h-[40px] w-full items-center rounded-md 
                 bg-slate-300 hover:bg-slate-400/60 dark:bg-moon-200 hover:dark:bg-moon-200/90">
                  <Globe className="mx-4 mr-3 h-4" />
                  <p className="text-[14px] font-medium">Language</p>
                </button>
                {session && (
                  <button
                    onClick={() => setLogoutShow(true)}
                    className="flex h-[40px] items-center rounded-md bg-blue-500
                bg-gradient-to-br text-white hover:bg-blue-600 w-full">
                    <LogOut className="mx-4 mr-3 h-4 font-medium text-white" />
                    <p className="text-[14px] font-medium text-white">
                      Sign Out
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Sign Out?"
        isOpen={logoutShow}
        onClose={() => setLogoutShow(false)}>
        <LogoutWindow setShow={setLogoutShow} />
      </Modal>
    </>
  );
}
