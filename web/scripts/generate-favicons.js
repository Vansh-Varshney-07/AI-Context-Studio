#!/usr/bin/env node
/**
 * Generate PNG favicons from SVG source
 * Requires: sharp (npm install sharp)
 * Run: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SVG_SOURCE = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');

const SIZES = [
  { name: 'favicon-16x16', size: 16 },
  { name: 'favicon-32x32', size: 32 },
  { name: 'favicon-48x48', size: 48 },
  { name: 'apple-touch-icon', size: 180 },
  { name: 'icon-192x192', size: 192 },
  { name: 'icon-512x512', size: 512 },
];

async function generateFavicons() {
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error('SVG source not found:', SVG_SOURCE);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  for (const { name, size } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 59, g: 130, b: 246, alpha: 1 }, // #3B82F6
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${name}.png (${size}x${size})`);
    } catch (err) {
      console.error(`✗ Failed to generate ${name}.png:`, err.message);
    }
  }

  // Generate ICO (multi-resolution)
  const icoSizes = [16, 32, 48];
  try {
    const icoBuffers = await Promise.all(
      icoSizes.map(size =>
        sharp(svgBuffer)
          .resize(size, size, { fit: 'contain', background: { r: 59, g: 130, b: 246, alpha: 1 } })
          .png()
          .toBuffer()
      )
    );
    // Note: sharp doesn't directly create ICO, you'd need a separate tool like 'to-ico'
    // For now, we'll skip ICO generation
    console.log('✓ PNG favicons generated. Run `npx to-ico icons/favicon-16x16.png icons/favicon-32x32.png icons/favicon-48x48.png > public/favicon.ico` for ICO');
  } catch (err) {
    console.error('ICO generation skipped:', err.message);
  }

  console.log('\n✅ Favicon generation complete!');
  console.log('Next steps:');
  console.log('1. Run `npx to-ico public/icons/favicon-16x16.png public/icons/favicon-32x32.png public/icons/favicon-48x48.png > public/favicon.ico`');
  console.log('2. Update manifest.json with all icon sizes');
}

generateFavicons().catch(console.error);