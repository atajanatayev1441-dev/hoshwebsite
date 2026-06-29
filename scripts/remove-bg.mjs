import sharp from 'sharp'

// ── HOŞ LOUNGE: gold logo on dark leather ──────────────────────────────────
// Gold: R high, R >> B (R/B ratio > 1.8), G medium
// Dark bg: all channels low, no golden hue
async function processLounge() {
  const { data, info } = await sharp('./public/images/hoslounge.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const rgba = Buffer.alloc(width * height * 4)

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3]
    const g = data[i * 3 + 1]
    const b = data[i * 3 + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    // Pixel is "golden" if R significantly exceeds B and is reasonably bright
    const isGolden = r > 75 && r > b * 1.7

    let alpha
    if (lum < 20) {
      alpha = 0  // pure black / very dark → transparent
    } else if (isGolden) {
      // Gold pixels: keep, fade gently at dark edges
      alpha = Math.min(255, Math.round((lum - 10) / 40 * 255))
    } else {
      // Non-gold darker areas (inner bg, shadows) → remove more aggressively
      alpha = lum < 50 ? 0 : Math.round((lum - 50) / 80 * 255)
    }

    rgba[i * 4]     = r
    rgba[i * 4 + 1] = g
    rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = Math.max(0, Math.min(255, alpha))
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('./public/images/hoslounge.png')

  console.log(`✓ hoslounge.png (${width}×${height})`)
}

// ── HOŞ COFFEE: white logo on sage-green textured background ────────────────
// White logo: min(R,G,B) ≈ 240+, saturation ≈ 0
// Sage green bg: G > R, G > B, saturation ≈ 20-50, min ≈ 100-185
// Key: penalise saturation heavily → bg drops to 0, white stays high
async function processCoffee() {
  const { data, info } = await sharp('./public/images/hoscoffee.webp')
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const rgba = Buffer.alloc(width * height * 4)

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]

    const minC = Math.min(r, g, b)
    const maxC = Math.max(r, g, b)
    const sat  = maxC - minC  // 0 = grey/white, high = colour

    // Whiteness = brightness minus heavy saturation penalty
    // White pixels (sat≈3):  250 - 7   = 243 → opaque
    // Light bg (sat≈25):     175 - 62  = 113 → transparent
    // Medium bg (sat≈35):    145 - 87  = 58  → transparent
    const whiteness = minC - sat * 2.5

    let alpha
    if (whiteness < 170)      alpha = 0
    else if (whiteness < 225) alpha = Math.round((whiteness - 170) / 55 * 255)
    else                      alpha = 255

    rgba[i * 4]     = r
    rgba[i * 4 + 1] = g
    rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = Math.max(0, Math.min(255, alpha))
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('./public/images/hoscoffee.png')

  console.log(`✓ hoscoffee.png (${width}×${height})`)
}

await processLounge()
await processCoffee()
