const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as unknown as import("next").NextConfig;

export default nextConfig;
