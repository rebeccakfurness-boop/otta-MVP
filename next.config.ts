import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Online forms carry supporting documents (up to 4 MB in all, under Vercel's 4.5 MB request limit).
    serverActions: { bodySizeLimit: "5mb" },
  },
  partialPrefetching: true,
  // The application PDF and underwriting worksheet read files from disk at runtime.
  outputFileTracingIncludes: {
    "/portal/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png", "./src/lib/uw/*.xlsx"],
    "/apply/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png", "./src/lib/uw/*.xlsx"],
    "/downloads/**": ["./src/lib/pdf/fonts/*.ttf", "./public/brand/otta-logo.png"],
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
