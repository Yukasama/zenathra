import {
  Calendar,
  Cpu,
  GanttChartSquare,
  SlidersHorizontal,
} from "lucide-react";

export const SITE = {
  name: "Elysium",
  description:
    "A stock market analysis tool that provides a visual representation of the market's performance.",
  url: "https://elysium.com",
  links: {
    twitter: "https://twitter.com/yukasama",
    github: "https://github.com/yukasama",
    linkedin: "https://www.linkedin.com/in/yukasama",
    youtube: "https://www.youtube.com/channel/elysium",
    instagram: "https://www.instagram.com/elysium",
  },
  keywords: [
    "elysium",
    "stocks",
    "stock market",
    "stock market tool",
    "stock market app",
    "stock market website",
  ],
  creator: "Yukasama",
};

export const navLinks = [
  {
    title: "Manage Portfolios",
    href: "/portfolio",
    description:
      "Track and optimize your investments with our portfolio manager.",
    icon: GanttChartSquare,
  },
  {
    title: "AI Analysis",
    href: "/stocks",
    description:
      "Harness AI-driven insights to analyze market trends and stock performance.",
    icon: Cpu,
  },
  {
    title: "Stock Screener",
    href: "/screener",
    description: "Allows you to research the stock market beyond your limits.",
    icon: SlidersHorizontal,
  },
  {
    title: "Economic Calendar",
    href: "/calendar",
    description: "Track key financial events to guide your investment choices.",
    icon: Calendar,
  },
];

export const footerLinks = [
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Privacy",
    url: "/privacy",
  },
  {
    name: "Terms",
    url: "/terms",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];
