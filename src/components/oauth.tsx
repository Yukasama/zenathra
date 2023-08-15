"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

interface Props {
  provider: "google" | "facebook" | "github";
}

export default function OAuth({ provider }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await signIn(provider, { redirect: true });
    } catch {
      toast.error(
        `An error occurred during authentication with ${
          provider[0].toUpperCase() + provider.slice(1)
        }.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      className="f-box gap-3.5 rounded-md border border-slate-300/60 bg-slate-200/60 p-2.5 px-11 hover:bg-slate-300/80 dark:border-moon-100 dark:bg-moon-300 dark:hover:bg-moon-200">
      <Image
        className={`scale-90 duration-200 group-hover:scale-75 ${
          provider === "github" && "dark:invert"
        } transition-opacity ${loading && "opacity-20"}`}
        src={`/images/oauth/${provider}.png`}
        width={30}
        height={30}
        alt={provider[0].toUpperCase() + provider.slice(1) + "Provider" || "OAuth Provider"}
        loading="eager"
      />
      {loading && (
        <ScaleLoader className="absolute" color="white" height={15} width={2} />
      )}
      <p
        className={`font-medium duration-200 transition-opacity ${
          loading && "opacity-20"
        }`}>
        Continue with {provider[0].toUpperCase() + provider.slice(1)}
      </p>
    </button>
  );
}
