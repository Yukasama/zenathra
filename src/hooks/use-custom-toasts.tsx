import { toast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link onClick={() => dismiss()} href="/sign-in">
          <Button aria-label="Sign In">Sign In</Button>
        </Link>
      ),
    });
  };

  const defaultError = () => {
    toast({
      title: "Oops! Something went wrong.",
      description: `Please try again later.`,
      variant: "destructive",
    });
  };

  return { loginToast, defaultError };
};
