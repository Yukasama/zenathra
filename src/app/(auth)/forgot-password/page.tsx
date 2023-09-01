import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForgotPasswordForm from "@/components/auth-forgot-password-form";

export default function page() {
  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Forgot Your Password?</CardTitle>
        <CardDescription>Request A Reset Link Here</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForgotPasswordForm />
      </CardContent>
      <CardFooter>
        <div className="f-box mt-2 gap-1">
          <p className="text-sm">Already signed up?</p>
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900">
            Sign In.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
