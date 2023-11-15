import OAuth from "../oauth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyLogo from "@/components/shared/company-logo";

export const metadata = { title: "Sign Up" };

export default function SignUp() {
  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader className="flex">
        <div className="flex items-center gap-3.5">
          <CompanyLogo px={50} />
          <div className="f-col gap-1">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new Account</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="f-col gap-2">
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </CardContent>

      <CardFooter>
        <div className="f-box gap-1 text-sm">
          <p>Already signed up?</p>
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
            Sign In.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
