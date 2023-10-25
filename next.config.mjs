await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "financialmodelingprep.com",
      "lh3.googleusercontent.com",
      "scontent-frt3-2.xx.fbcdn.net",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
