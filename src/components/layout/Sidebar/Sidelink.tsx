"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  to: string;
  icon: JSX.Element;
  notext?: boolean;
  gap?: boolean;
  loading?: boolean;
}

export default function Sidelink({
  title,
  to,
  icon,
  gap,
  notext,
  loading,
}: Props) {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname ? pathname.split("/").pop() === path : "/";

  return (
    <>
      <Link
        href={to}
        className={`${
          isActive(to.split("/").pop()!) &&
          "border-moon-700 bg-gray-300/80 dark:bg-moon-200"
        } m-1 mx-4 flex cursor-pointer 
            items-center rounded-lg hover:bg-gray-300/80 dark:hover:bg-moon-200 ${
              loading && "animate-pulse-right h-12 w-12"
            }`}>
        {!loading && (
          <>
            <div className="p-3">{icon}</div>
            <p className={`${notext && "hidden"} whitespace-nowrap`}>{title}</p>
          </>
        )}
      </Link>
      <div
        className={`${
          gap && "m-3 mx-5 mt-4 h-[1px]"
        } bg-gray-400/60 dark:bg-moon-100`}></div>
    </>
  );
}
