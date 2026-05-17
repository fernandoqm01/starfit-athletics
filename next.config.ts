import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: "star-fit",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
