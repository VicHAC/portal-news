import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      // (Vercel tiene un límite estricto de 4.5MB, así que 4MB es lo seguro).
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;