import type { NextConfig } from "next";
import { Config } from "tailwindcss";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ceyufcdjltcefofcjgth.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        port: "",
        pathname: "/image-vector/**"
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**"
      }
    ]
  }
};

export default nextConfig;
