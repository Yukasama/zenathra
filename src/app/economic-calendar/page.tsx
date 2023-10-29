import { SITE } from "@/config/site";

export const runtime = "edge";

export const metadata = {
  title: `${SITE.name} | Economic Calendar`,
};

export default function page() {
  return (
    <div className="mt-52 text-center text-3xl font-thin">Coming soon...</div>
  );
}
