import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },
};

export default nextConfig;