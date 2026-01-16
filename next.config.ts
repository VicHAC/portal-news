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
  // Aumentamos el límite de subida para Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Permitir hasta 5 Megabytes por envío
    },
  },
};

export default nextConfig;