import Button from "@/components/ui/buttons/Button";
import { ArrowLeft } from "react-feather";
import Link from "next/link";

interface Props {
  link: string;
}

export default function BackButton({ link }: Props) {
  return (
    <Link href={link}>
      <Button label="Back" icon={<ArrowLeft className="h-5 w-5" />} />
    </Link>
  );
}
