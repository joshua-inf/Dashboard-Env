const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA({
  experimental: {
    turbo: false, // force webpack, required for next-pwa
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gaicgetnnwptxbqooywd.supabase.co',
      },
    ],
  },
})

module.exports = nextConfig
