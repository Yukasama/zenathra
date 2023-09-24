import SignIn from "@/components/auth/sign-in";
import { site } from "@/config/site";

export const metadata = {
  title: `Sign In - ${site.name}`,
};

export default function page() {
  return <SignIn />;
}
