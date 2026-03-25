import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // No custom webpack config — Turbopack is the default in Next.js 16
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
