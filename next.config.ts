import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: new URL(supabaseUrl).protocol.slice(0, -1) as "http" | "https",
            hostname: new URL(supabaseUrl).hostname,
            port: new URL(supabaseUrl).port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Local Supabase runs on a private IP
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { authInterrupts: true },
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
