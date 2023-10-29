import {
  Calendar,
  Cpu,
  GanttChartSquare,
  SlidersHorizontal,
} from "lucide-react";

export const SITE = {
  name: "Zenathra",
  description:
    "A stock market analysis tool that provides a visual representation of the market's performance.",
  url: "https://www.zenathra.com",
  links: {
    twitter: "https://twitter.com/yukasama",
    github: "https://github.com/yukasama",
    linkedin: "https://www.linkedin.com/in/yukasama",
    youtube: "https://www.youtube.com/channel/zenathra",
    instagram: "https://www.instagram.com/zenathra",
  },
  keywords: [
    "zenathra",
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
    href: "/economic-calendar",
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
    url: "/privacy-policy",
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
