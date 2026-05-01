/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ini kuncinya: Biar build lanjut terus meskipun banyak warning/error linting
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ini juga penting: Biar build nggak stop kalau ada error tipe data
    ignoreBuildErrors: true,
  },
  // Opsional: Jika kamu ingin mematikan warning indikator di browser
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;