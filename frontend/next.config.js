/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
    NEXT_PUBLIC_FACTORY_CONTRACT: process.env.NEXT_PUBLIC_FACTORY_CONTRACT,
  },
  // Disable static optimization for MVP (wallet integration is dynamic)
  experimental: {
    after: true,
  },
};

module.exports = withNextIntl(nextConfig);
