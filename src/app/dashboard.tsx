import PageLayout from "@/components/shared/page-layout";
import { User } from "next-auth";
import React from "react";

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  return (
    <PageLayout
      title={`Welcome back, ${user?.username}!`}
      description="Your personal dashboard. Everything in one place.">
      <div className="mt-40 text-center text-3xl font-thin">Coming soon...</div>
    </PageLayout>
  );
}
