import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthSignUp from "@/components/auth-sign-up";

export default function page() {
  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create Your Personal Account</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthSignUp />
      </CardContent>
      <CardFooter>
        <div className="f-box mt-2 gap-1">
          <p className="text-sm">Already signed up?</p>
          <Link
            href="/sign-in"
            className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-zinc-200">
            Sign In.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}