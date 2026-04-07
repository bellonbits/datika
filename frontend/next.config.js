/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone output
  output: 'standalone',

  // Required for Ant Design 5.x to work with Next.js App Router
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/cssinjs'],

  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
