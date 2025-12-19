/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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