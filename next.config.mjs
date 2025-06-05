/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/CascadeStudio' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/CascadeStudio' : '',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    config.module.rules.push({
      test: /\.(wasm)$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
