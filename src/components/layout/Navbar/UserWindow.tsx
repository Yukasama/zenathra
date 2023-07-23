"use client";

import { LogIn, Send, LogOut, Globe } from "react-feather";
import Image from "next/image";
import { useState } from "react";
import { Logout } from "@/components/routes/auth";
import Link from "next/link";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
  status: string;
  collapsed: boolean;
}

export default function UserWindow({ session, status, collapsed }: Props) {
  const [logoutShow, setLogoutShow] = useState(false);

  return (
    <div>
      <div
        id="login-window"
        className={`${
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
              bg-gray-200 dark:bg-moon-500">
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
              {!session ? (
                <div className="z-5 f-col w-full cursor-pointer items-center">
                  <Link
                    href="/auth/signin"
                    className="flex h-[40px] w-full items-center rounded-md bg-blue-500 hover:bg-blue-600">
                    <LogIn className="mx-4 mr-3 h-4 text-white" />
                    <p className="text-[14px] font-medium text-white">
                      Sign In
                    </p>
                  </Link>
                  <div className="my-0.5 flex items-center gap-2">
                    <div className="line w-[50px]"></div>
                    <p className="text-[12px] text-gray-400 dark:text-moon-100">
                      OR
                    </p>
                    <div className="line w-[50px]"></div>
                  </div>
                  <Link
                    href="/auth/register"
                    className="flex h-[40px] w-full items-center rounded-md bg-purple-600 hover:bg-purple-700">
                    <Send className="mx-4 mr-3 h-4 text-white" />
                    <p className="text-[14px] font-medium text-white">
                      Sign Up
                    </p>
                  </Link>
                  <div className="line mt-3 w-full"></div>
                  <div
                    className="mb-1 mt-3 flex h-[40px] w-full cursor-pointer items-center rounded-md
              bg-gray-300 hover:bg-gray-400/60 dark:bg-moon-200 hover:dark:bg-moon-200/90">
                    <Globe className="mx-4 mr-3 h-4" />
                    <p className="text-[14px] font-medium">Language</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col justify-between gap-3">
                  <div
                    className="flex h-[40px] w-full cursor-pointer items-center rounded-md 
              bg-gray-300 hover:bg-gray-400/60 dark:bg-moon-200 hover:dark:bg-moon-200/90">
                    <Globe className="mx-4 mr-3 h-4" />
                    <p className="text-[14px] font-medium">Language</p>
                  </div>
                  <button
                    onClick={() => setLogoutShow(true)}
                    className="flex h-[40px] cursor-pointer items-center rounded-md bg-blue-500
                  bg-gradient-to-br text-white hover:bg-blue-600">
                    <LogOut className="mx-4 mr-3 h-4 font-medium text-white" />
                    <p className="text-[14px] font-medium text-white">
                      Sign Out
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className={`${
          logoutShow ? "left-[calc(50%)] z-10 flex" : "hidden"
        } absolute`}>
        <Logout setShow={setLogoutShow} />
      </div>
    </div>
  );
}
