/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  distDir: "build",
  images: {
    domains: ['gaicgetnnwptxbqooywd.supabase.co'],
  },
});

module.exports = nextConfig;
