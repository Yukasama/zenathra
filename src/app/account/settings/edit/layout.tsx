import { Button } from "@/components/ui";
import { ArrowLeft } from "react-feather";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="f-box fixed left-0 top-0 z-30 h-screen w-screen bg-moon-300">
      <div className="absolute left-7 top-3.5">
        <Link href="/account/settings">
          <Button label="Back" icon={<ArrowLeft className="h-5 w-5" />} />
        </Link>
      </div>
      {children}
    </div>
  );
}
