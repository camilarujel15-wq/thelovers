import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920, 2400],
  },
};

export default nextConfig;
