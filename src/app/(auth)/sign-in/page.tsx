import Link from "next/link";
import AuthSignIn from "@/components/auth-sign-in";

export default function page() {
  return (
    <>
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Sign In To Your Account
      </h2>
      <AuthSignIn />
      <div className="f-box mt-2 gap-1">
        <p className="text-sm">New to our platform?</p>
        <Link
          href="/sign-up"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-zinc-200">
          Sign Up.
        </Link>
      </div>
    </>
  );
}
