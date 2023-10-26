import { buttonVariants } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="f-box mt-[360px]">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
          Not Found Error 404
        </h2>
        <p className="text-slate-400 dark:text-slate-200 text-sm">
          There was an error on our end.
        </p>
        <Link href="/" className={buttonVariants({ variant: "subtle" })}>
          <LinkIcon className="h-4 w-4" />
          Try again
        </Link>
      </div>
    </div>
  );
}
