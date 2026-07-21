import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'millahairstudio.vercel.app',
          },
        ],
        destination: 'https://www.millahairstudio.com/:path*',
        permanent: true, // HTTP 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
