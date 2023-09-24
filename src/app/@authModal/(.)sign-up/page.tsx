import SignUp from "@/components/auth/sign-up";
import { site } from "@/config/site";

export const metadata = {
  title: `Sign Up - ${site.name}`,
};

export default function page() {
  return <SignUp />;
}
