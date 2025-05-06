import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
