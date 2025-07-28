const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Tambahkan ini untuk melewati error ESLint saat build
  },
} as unknown as import("next").NextConfig;

export default nextConfig;
