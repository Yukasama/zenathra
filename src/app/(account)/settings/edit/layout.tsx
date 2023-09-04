import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="f-box fixed left-0 top-0 z-30 h-screen w-screen bg-zinc-300">
      <div className="absolute left-7 top-3.5">
        <Link href="/settings">
          <Button>
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
