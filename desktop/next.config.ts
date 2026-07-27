import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isAnalyze = process.env.ANALYZE === "true";
const isTauri = process.env.TAURI === "true" || process.env.TAURI === "1";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: isTauri ? "export" : undefined,
  images: {
    unoptimized: isTauri,
  },
  compiler: {
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "framer-motion",
    ],
    externalDir: false,
  },
turbopack: {
    root: __dirname,
    resolveAlias: {
      "@/*": "./src/*",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: http://localhost:* ws://localhost:*",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    // Add path aliases for both client and server
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/*": "./src/*",
    };

    if (isAnalyze && !isServer) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: "../bundle-analyzer.html",
          openAnalyzer: false,
        }),
      );
    }
    return config;
  },
};

export default nextConfig;
