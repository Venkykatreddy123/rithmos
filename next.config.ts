import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },
  // Optimize compilation workers & memory
  experimental: {
    cpus: 2,
  },
  // Allow Three.js dynamic imports
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
