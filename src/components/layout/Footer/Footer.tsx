import Image from "next/image";
import Link from "next/link";
import { footerLinks, socials } from "@/config/footer";

export default function Footer() {
  return (
    <div className="f-col w-full justify-between gap-8 bg-gray-300/50 px-10 xl:px-60 py-4 pt-7 shadow-sm dark:bg-moon-600 dark:shadow-moon-100">
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
          {footerLinks.map((footerLink) => (
            <div key={footerLink.title} className="w-20">
              <h2 className="mb-2 uppercase tracking-widest text-gray-500">
                {footerLink.title}
              </h2>
              <div className="f-col gap-1.5">
                {footerLink.links.map((link) => (
                  <Link key={link.name} href={link.link} className="text-sm">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="f-col gap-3">
        <div className="h-[1px] bg-gray-300 dark:bg-moon-100"></div>
        <div className="mx-2 flex-res flex-col-reverse lg:flex-row-reverse items-center justify-between">
          <div className="flex gap-5">
            <p className="hidden lg:flex text-[13px] text-gray-500">
              Please note that this website is in development stage.
            </p>
            <Link
              className="text-[13px] text-gray-500 hover:underline"
              href="/privacy">
              Privacy
            </Link>
            <Link
              className="text-[13px] text-gray-500 hover:underline"
              href="/terms">
              Terms
            </Link>
            <p className="text-[13px] text-gray-500">&copy; 2023 Elysium</p>
          </div>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <Link
                key={social.name}
                href="/"
                className="flex-box h-10 w-10 rounded-md">
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
