import { site } from "@/config/site";
import Image from "next/image";

export default function page() {
  return (
    <Image
      src="/images/logo"
      height={600}
      width={600}
      alt={`${site.name} Logo`}
    />
  );
}
