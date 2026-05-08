/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true, // Enable gzip/brotli compression
  transpilePackages: ['lucide-react', 'framer-motion', 'lenis'],
  images: {
    // Serve modern image formats for significant bandwidth savings
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'calendly.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.google.com', pathname: '/**' },
    ],
  },
  trailingSlash: false, // Standardize on non-trailing slash URLs for SEO consistency
  // Add caching headers for static assets
  async headers() {
    return [
      {
        source: '/:path*\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
