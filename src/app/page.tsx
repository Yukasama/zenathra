import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./landing-page";
import Dashboard from "./dashboard";

export const metadata = { title: "Home" };
export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  if (!user) {
    return <LandingPage />;
  }

  const userExists = await db.user.count({
    where: { id: user.id },
  });

  if (!userExists) {
    redirect("/auth-callback?origin=/");
  }

  return <Dashboard user={user} />;
}
