interface SiteProps {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
}

export const site: SiteProps = {
  name: "Elysium",
  description:
    "A stock market analysis tool that provides a visual representation of the market's performance.",
  url: "https://elysium.com",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/yukasama/elysium",
  },
};
