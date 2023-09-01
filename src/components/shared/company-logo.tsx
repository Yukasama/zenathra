import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  px: number;
}

export default function CompanyLogo({ px, className }: Props) {
  return (
    <Image
      className={cn("rounded-full", className)}
      src="/images/logo/logo.png"
      width={px}
      height={px}
      alt={`${site.name} Logo`}
    />
  );
}
