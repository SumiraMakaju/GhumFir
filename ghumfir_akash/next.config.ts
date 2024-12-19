import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
      staleTimes:{
        dynamic:30,
      },
    },
    serverExternalPackages: ["@node-rs/argon2"], 
    reactStrictMode: true,
};

export default nextConfig;
