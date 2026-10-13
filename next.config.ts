import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The application PDF and underwriting worksheet read files from disk at runtime.
  outputFileTracingIncludes: {
    "/portal/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png", "./src/lib/uw/*.xlsx"],
    "/apply/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png", "./src/lib/uw/*.xlsx"],
    "/admin/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png", "./src/lib/uw/*.xlsx"],
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
