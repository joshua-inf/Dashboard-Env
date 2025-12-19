/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gaicgetnnwptxbqooywd.supabase.co',
      },
    ],
  },
};

export default nextConfig;