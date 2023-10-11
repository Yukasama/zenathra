"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function SettingsItem({ id, label, icon }: Props) {
  const pathname = usePathname();

  return (
    <Link
      key={id}
      href={`/settings/${id}`}
      className={`text-md flex gap-3 p-1.5 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 items-center ${
        pathname.split("/").pop() === id && "bg-slate-100 dark:bg-slate-800"
      }`}>
      {icon}
      <p>{label}</p>
    </Link>
  );
}
