/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Only Cloudinary — a bare '**' turns /_next/image into an open SSRF
      // proxy that will fetch any https URL an attacker passes it.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Site has no reason to be framed by anyone — blocks clickjacking
          // (e.g. an invisible iframe over the order form).
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          // Stops browsers from MIME-sniffing a response into something
          // executable (e.g. treating an uploaded image as HTML/JS).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Force HTTPS for a year on every visit, including subdomains.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
