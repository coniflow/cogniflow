/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  basePath: '/cogniflow',
  assetPrefix: '/cogniflow/',
  trailingSlash: true,
};

module.exports = nextConfig;
