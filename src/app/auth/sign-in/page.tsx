import Link from "next/link";
import { AuthSignInForm } from "@/components";

export default function page() {
  return (
    <>
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Sign In To Your Account
      </h2>
      <AuthSignInForm />
      <div className="f-box mt-2 gap-1">
        <p className="text-sm">New to our platform?</p>
        <Link
          href="/auth/sign-up"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-moon-200">
          Sign Up.
        </Link>
      </div>
    </>
  );
}
