/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['web-production-75198.up.railway.app', 'localhost:3000']
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['files.markupgo.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ["puppeteer"],
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  env: {
    NEXTAUTH_URL: process.env.RAILWAY_STATIC_URL 
      ? `https://${process.env.RAILWAY_STATIC_URL}` 
      : process.env.NEXTAUTH_URL || 'http://localhost:3000',
  }
}

module.exports = nextConfig 