import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
      staleTimes:{
        dynamic:30,
      },
    },
    serverExternalPackages: ["@node-rs/argon2"], 
};
module.exports = {
  images: {
    domains: ['example.com'], // Add the domain here
  },
}

export default nextConfig;
