import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Completely skip ESLint checks during build & dev
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
