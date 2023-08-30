import AuthForgotPasswordForm from "@/components/auth-forgot-password-form";

export default function page() {
  return (
    <>
      <h2 className="mb-1.5 text-center text-xl font-medium">
        Forgot Your Password?
      </h2>
      <AuthForgotPasswordForm />
    </>
  );
}
