interface SiteProps {
  name: string;
  description: string;
  url: string;
  links: { [key: string]: string };
  keywords: string[];
  creator: string;
}

export const site: SiteProps = {
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

export const footerLinks = [
  {
    title: "Company",
    links: [
      {
        name: "About Us",
        link: "/about",
      },
      {
        name: "Careers",
        link: "/careers",
      },
      {
        name: "Contact Us",
        link: "/contact",
      },
    ],
  },
  {
    title: "Pricing",
    links: [
      {
        name: "About Us",
        link: "/about",
      },
      {
        name: "Careers",
        link: "/careers",
      },
      {
        name: "Contact Us",
        link: "/contact",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        name: "About Us",
        link: "/about",
      },
      {
        name: "Careers",
        link: "/careers",
      },
      {
        name: "Contact Us",
        link: "/contact",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        name: "About Us",
        link: "/about",
      },
      {
        name: "Careers",
        link: "/careers",
      },
      {
        name: "Contact Us",
        link: "/contact",
      },
    ],
  },
];
