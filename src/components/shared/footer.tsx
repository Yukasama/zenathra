import Image from "next/image";
import Link from "next/link";
import { footerLinks, site } from "@/config/site";
import CompanyLogo from "./company-logo";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border-none rounded-none px-20 w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CompanyLogo px={40} />
          <CardTitle>Elysium</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="f-col gap-6 px-3">
          <div className="grid grid-cols-2 lg:flex gap-5 lg:gap-16">
            {footerLinks.map((footerLink, i) => (
              <div key={`${footerLink.title}-${i}`} className="w-20">
                <h2 className="mb-2 uppercase tracking-widest text-slate-500">
                  {footerLink.title}
                </h2>
                <div className="f-col gap-1.5">
                  {footerLink.links.map((link, i) => (
                    <Link
                      key={`${link.name}-${i}`}
                      href={link.link}
                      className="text-sm">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="f-col gap-3 w-full">
          <Separator />
          <div className="mx-2 f-col lg:flex-row flex-col-reverse items-center justify-between">
            <div className="flex items-center gap-5">
              <p className="text-[13px] text-slate-500">
                &copy; 2023 {site.name[0].toUpperCase() + site.name.slice(1)}
              </p>
              <Link
                className="text-[13px] text-slate-500 hover:underline"
                href="/privacy">
                Privacy
              </Link>
              <Link
                className="text-sm text-slate-500 hover:underline"
                href="/terms">
                Terms
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {Object.entries(site.links).map(([name, url]) => (
                <Link
                  key={name}
                  href={url}
                  className="f-box h-10 w-10 rounded-md">
                  <Image
                    className={`${name === "github" && "dark:invert"}`}
                    src={`/images/oauth/${name}.png`}
                    height={20}
                    width={20}
                    alt={name[0].toUpperCase() + name.slice(1)}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
