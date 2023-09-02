import AuthSignIn from "@/components/auth-sign-in";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Card className="p-2">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Login To Your Account</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthSignIn />
        </CardContent>
        <CardFooter>
          <div className="f-box mt-2 gap-1">
            <p className="text-sm">New to our platform?</p>
            <Link
              href="/sign-up"
              className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
              Sign Up.
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
