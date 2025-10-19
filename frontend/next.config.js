/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
    NEXT_PUBLIC_FACTORY_CONTRACT: process.env.NEXT_PUBLIC_FACTORY_CONTRACT,
  }
};

module.exports = withNextIntl(nextConfig);
