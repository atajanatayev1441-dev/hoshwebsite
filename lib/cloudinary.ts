// Cloudinary already resizes/compresses/negotiates format at its CDN edge — far
// cheaper than asking Next's built-in image optimizer to re-encode on our own
// container. This rewrites an uploaded Cloudinary URL to request an
// appropriately-sized, auto-format/quality version instead of the original —
// then routes it through our own /api/image proxy, since res.cloudinary.com
// itself is unreachable for visitors without a VPN in some regions.
export function cldOptimize(url: string | null | undefined, width: number): string {
  if (!url) return ''
  const marker = '/upload/'
  const idx = url.indexOf(marker)
  if (!url.includes('res.cloudinary.com') || idx === -1) return url
  const before = url.slice(0, idx + marker.length)
  const after = url.slice(idx + marker.length)
  const transformed = `${before}f_auto,q_auto,w_${width},c_limit/${after}`
  return `/api/image?url=${encodeURIComponent(transformed)}`
}
