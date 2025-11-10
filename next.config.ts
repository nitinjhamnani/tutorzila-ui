
import type { NextConfig } from 'next';
import withPWAConstructor from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const withPWA = withPWAConstructor({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
  scope: '.', // By setting the scope to '.', we allow the PWA to be installed from any sub-directory.
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
