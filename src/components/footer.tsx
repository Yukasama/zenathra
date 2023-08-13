import Image from "next/image";
import Link from "next/link";
import { footerLinks, socials } from "@/config/footer-config";

export default function Footer() {
  return (
    <div className="f-col w-full justify-between gap-8 bg-slate-300/50 px-10 xl:px-60 py-4 pt-7 shadow-sm dark:bg-moon-600 dark:shadow-moon-100">
      <div className="f-col gap-6 px-3">
        <div className="flex items-center gap-3">
          <Image
            className="rounded-md"
            src="/images/logo/logo.png"
            width={40}
            height={40}
            alt="Company Logo"
          />
          <p className="text-lg font-light">Elysium</p>
        </div>
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

      <div className="f-col gap-3">
        <div className="h-[1px] bg-slate-300 dark:bg-moon-100"></div>
        <div className="mx-2 f-res flex-col-reverse lg:flex-row-reverse items-center justify-between">
          <div className="flex gap-5">
            <p className="hidden lg:flex text-[13px] text-slate-500">
              Please note that this website is in development stage.
            </p>
            <Link
              className="text-[13px] text-slate-500 hover:underline"
              href="/privacy">
              Privacy
            </Link>
            <Link
              className="text-[13px] text-slate-500 hover:underline"
              href="/terms">
              Terms
            </Link>
            <p className="text-[13px] text-slate-500">&copy; 2023 Elysium</p>
          </div>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <Link
                key={social.name}
                href="/"
                className="f-box h-10 w-10 rounded-md">
                <Image
                  className={`${social.name === "github" && "dark:invert"}`}
                  src={`/images/oauth/${social.name}.png`}
                  height={20}
                  width={20}
                  alt={social.name[0].toUpperCase() + social.name.slice(1)}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
