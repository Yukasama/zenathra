"use client";

import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { FormEvent } from "react";

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
      toast.success("Logged out successfully.", { id: loading });
    } catch {
      toast.error("An error occurred during logout.", { id: loading });
    }
  };

  return (
    <div className="absolute left-[calc(50%-300px)] top-[200px] f-col h-[350px] w-[600px] justify-between rounded-lg bg-gray-200 p-8 dark:bg-moon-500">
      <div>
        <p className="text-[20px] font-medium">Sign Out?</p>
        <p className="text-gray-500 dark:text-gray-500">
          Are you sure you want to logout?
        </p>
      </div>
      <div className="mr-10 flex w-full justify-end gap-5">
        <button
          onClick={() => setShow(false)}
          className="rounded-md bg-blue-500 p-2 px-5 font-medium text-white hover:bg-blue-600">
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 p-2 px-5 font-medium text-white hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
