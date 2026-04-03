/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['lucide-react', 'framer-motion', 'lenis'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'calendly.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
