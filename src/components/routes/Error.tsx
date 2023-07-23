"use client";

import Button from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "react-feather";

interface Props {
  error?: string;
  statusCode?: number;
  action?: "refresh" | "back" | "home";
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
}

export default function Error({
  error = "An Error Occurred",
  statusCode = 400,
  action = "refresh",
  buttonLabel = "Try Again",
  buttonIcon = <RefreshCcw className="h-4 w-4" />,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex-box h-[680px] flex-col">
      <p className="text-[50px] font-bold">{statusCode}</p>
      <p className="mb-5 text-[20px]">{error}</p>
      <Button
        onClick={() => {
          if (action === "refresh") {
            router.refresh();
          } else if (action === "back") {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="px-10"
        label={buttonLabel}
        color="blue"
        icon={buttonIcon}
      />
    </div>
  );
}
