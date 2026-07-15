import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wq5fgzz105.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
