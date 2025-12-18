import nextPwa from 'next-pwa'

const withPWA = nextPwa({
  dest: 'public',
  register: true,

  disable: process.env._NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  output: "standalone",
  distDir: 'build',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gaicgetnnwptxbqooywd.supabase.co',
      },
    ],
  },
})

export default nextConfig
