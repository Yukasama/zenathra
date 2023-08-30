import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="f-box fixed left-0 top-0 z-30 h-screen w-screen bg-slate-100 dark:bg-zinc-300">
      <div className="absolute left-7 top-3.5">
        <Link href="/">
          <Button>
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </Link>
      </div>
      <div className="flex translate-y-2 flex-col gap-3 rounded-xl border border-slate-300/60 bg-slate-200/20 p-10 pb-6 pt-5 dark:border-zinc-200 dark:bg-zinc-400/50 md:translate-y-0">
        {children}
      </div>
    </div>
  );
}