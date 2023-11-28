import OAuth from "../oauth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyLogo from "@/components/shared/company-logo";
import Link from "next/link";
import SignUp from "./sign-up";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Sign Up" };
// export const runtime = "edge";

export default function page() {
  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <CompanyLogo px={50} />
          <div className="f-col gap-1">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="f-col gap-4">
        <div className="text-[12px] bg-red-500/60 p-1 px-3 rounded-md">
          Credentials login is currently disabled. Please use one of the OAuth
          providers below.
        </div>

        <SignUp />
        <Separator />

        <div className="f-col gap-[9px]">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </CardContent>

      <CardFooter>
        <div className="f-box gap-1 text-sm">
          Already signed up?
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Sign In.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
