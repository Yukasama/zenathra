import Image from "next/image";
import { site } from "@/config/site";

interface Props {
  px: number;
}

export default function CompanyLogo({ px }: Props) {
  return (
    <Image
      className="rounded-full"
      src="/images/logo/logo.png"
      width={px}
      height={px}
      alt={`${site.name} Logo`}
    />
  );
}
