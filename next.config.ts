import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make sure the hand-pasted code sections ship with the server code on Vercel.
  outputFileTracingIncludes: {
    "/**": ["./data/code-sections/**"],
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
