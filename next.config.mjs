/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Memaksa build lanjut terus meskipun ada warning/error linting
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Memaksa build tidak stop kalau ada error tipe data (TypeScript)
    ignoreBuildErrors: true,
  },
  devIndicators: {
    // Mematikan indikator build di pojok browser
    buildActivity: false,
  },
};

export default nextConfig;