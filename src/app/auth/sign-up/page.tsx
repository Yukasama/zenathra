import Link from "next/link";
import AuthSignUpForm from "@/components/auth-sign-up-form";

export default function page() {
  return (
    <>
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Create Your Account
      </h2>
      <AuthSignUpForm />
      <div className="f-box mt-2 gap-1">
        <p className="text-sm">Already with us?</p>
        <Link
          href="/auth/signin"
          className="rounded-md p-1 px-1.5 text-sm font-medium text-blue-500 hover:bg-slate-300 dark:hover:bg-moon-200">
          Sign In.
        </Link>
      </div>
    </>
  );
}
