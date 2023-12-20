import { getUser } from "@/lib/auth";
import LandingPage from "./landing-page";
import Dashboard from "./dashboard";

export const metadata = { title: "Home" };
// export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard user={user} />;
}
