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

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
