import path from "path";
import type { NextConfig } from "next";

// Use local copy (run "npm run copy-convex" after convex codegen from repo root)
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@convex/api": "./convex-generated/api",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@convex/api": path.resolve(__dirname, "convex-generated", "api"),
    };
    return config;
  },
};

export default nextConfig;
