import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
      staleTimes:{
        dynamic:30,
      },
    },
    serverExternalPackages: ["@node-rs/argon2"], 
    images:{
      domains: ['utfs.io'], // Add the domain here
      remotePatterns:[
        {
        protocol: "https",
        hostname: "utfs.io",
        pathname:`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
        },
      ]
    },
};

export default nextConfig;
