import { toast } from "@/hooks/use-toast";
import { Button, Link } from "@nextui-org/react";

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Button
          href="/sign-in"
          onClick={() => dismiss()}
          aria-label="Sign In"
          as={Link}>
          Sign In
        </Button>
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
