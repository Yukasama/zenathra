import PageLayout from "@/components/shared/page-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <PageLayout
      title={`Welcome back, ${user?.name}!`}
      description="Your personal dashboard. Everything in one place.">
      <div className="mt-40 text-center text-3xl font-thin">Coming soon...</div>
    </PageLayout>
  );
}
