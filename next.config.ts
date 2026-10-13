import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The application form PDF reads its fonts and logo from disk at runtime.
  outputFileTracingIncludes: {
    "/portal/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
