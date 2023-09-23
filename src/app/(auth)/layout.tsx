import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="f-box fixed left-0 top-0 z-20 h-screen w-screen bg-card">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "subtle" }),
          "absolute top-4 left-4"
        )}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      {children}
    </div>
  );
}
