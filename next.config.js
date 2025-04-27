/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'esarvgxiosuoxgfuwhqy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['esarvgxiosuoxgfuwhqy.supabase.co'],
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/lf-folder' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lf-folder/' : '',
}

module.exports = nextConfig 