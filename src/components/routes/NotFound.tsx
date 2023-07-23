import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { ExternalLink } from "react-feather";

export default function NotFound() {
  return (
    <div className="flex-box h-[680px] flex-col">
      <p className="text-[50px] font-bold">404</p>
      <p className="mb-5 text-[20px]">Page Not Found.</p>
      <Link href="/">
        <Button
          className="px-10"
          label="Back to Home"
          color="blue"
          icon={<ExternalLink className="h-4 w-4" />}
        />
      </Link>
    </div>
  );
}
