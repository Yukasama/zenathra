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
import SignIn from "./sign-in";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Sign In" };
// export const runtime = "edge";

export default function page() {
  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader>
        <div className="flex items-center gap-3.5">
          <CompanyLogo px={50} />
          <div className="f-col gap-1">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Log in to your account</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="f-col gap-4">
        <div className="text-[12px] bg-red-500/60 p-1 px-3 rounded-md">
          Credentials login is currently disabled. Please use one of the OAuth
          providers below.
        </div>

        <SignIn />
        <Separator />

        <div className="f-col gap-[9px]">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </div>
      </CardContent>

      <CardFooter>
        <div className="f-box gap-1 text-sm">
          New to our platform?
          <Link
            href="/sign-up"
            className="rounded-md p-1 px-1.5 font-medium text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Sign Up.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
