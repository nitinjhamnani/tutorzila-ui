import type { NextConfig } from 'next';
import withPWAConstructor from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const withPWA = withPWAConstructor({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
  // Example for custom worker starting from Next 15.2.4
  // swSrc: 'app/sw.ts', 
  // swDest: 'public/sw.js',
  // fallbacks: { // Optional: configure fallbacks for offline
  //   document: '/_offline', // Ensure you have an offline fallback page at pages/_offline.tsx or app/_offline/page.tsx
  //   image: '/static/images/fallback.png', // Example fallback image
  // },
});

const nextConfig: NextConfig = {
  /* config options here */
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
