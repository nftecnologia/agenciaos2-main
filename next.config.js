/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['files.markupgo.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer"]
  }
}

module.exports = nextConfig 