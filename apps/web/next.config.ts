import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow API requests to backend
  async rewrites() {
    return [];
  },
};

export default nextConfig;
