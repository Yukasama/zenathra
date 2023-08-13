"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  provider: "google" | "facebook" | "github";
}

export default function OAuth({ provider }: Props) {
  const handleAuth = async () => {
    try {
      await signIn(provider);
      // toast.success(
      //   `Successfully authenticated with ${
      //     provider[0].toUpperCase() + provider.slice(1)
      //   }.`
      // );
    } catch {
      toast.error("An error occurred during authentication.");
    }
  };

  return (
    <button
      onClick={handleAuth}
      className="f-box gap-3.5 rounded-md border border-slate-300/60 bg-slate-200/60 p-2.5 px-11 hover:bg-slate-300/80 dark:border-moon-100 dark:bg-moon-300 dark:hover:bg-moon-200">
      <Image
        className={`scale-90 duration-300 group-hover:scale-75 ${
          provider === "github" && "dark:invert"
        }`}
        src={`/images/oauth/${provider}.png`}
        width={30}
        height={30}
        alt={provider[0].toUpperCase() + provider.slice(1) + "Provider"}
        loading="eager"
      />
      <p className="font-medium">
        Continue with {provider[0].toUpperCase() + provider.slice(1)}
      </p>
    </button>
  );
}
