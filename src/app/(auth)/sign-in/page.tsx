import OAuth from "./oauth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyLogo from "@/components/shared/company-logo";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Sign In" };
export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="f-box fixed left-0 top-0 z-20 h-screen w-screen bg-background">
      {/* Back Button */}
      <Link href="/">
        <Button className="absolute top-5 left-5">
          <ArrowLeft size={18} />
          Back
        </Button>
      </Link>

      {/* Content */}
      <Card className="md:p-2 w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-3.5">
            <CompanyLogo px={50} />
            <div className="f-col gap-1">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>or create a new account</CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* OAuth */}
        <CardContent className="f-col gap-[9px]">
          <OAuth provider="google" />
          <OAuth provider="facebook" />
          <OAuth provider="github" />
        </CardContent>
      </Card>
    </div>
  );
}
