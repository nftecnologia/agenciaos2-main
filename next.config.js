/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['files.markupgo.com'],
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig 