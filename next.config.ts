import type { NextConfig } from 'next';
import { securityHeaders } from './src/_lib/securityHeaders';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders(process.env.NODE_ENV),
      },
    ];
  },
};

export default nextConfig;
