#!/usr/bin/env node
/**
 * Image Optimization Script for Start Permis
 *
 * Converts PNG/JPG images to WebP format with quality optimization.
 * Requires: npm install sharp
 *
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Run: npm install sharp --save-dev');
  console.log('Then run this script again.');
  process.exit(1);
}

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const WEBP_QUALITY = 80;
const MIN_SIZE_KB = 50; // Only convert images larger than 50KB

async function optimizeImages() {
  const files = fs.readdirSync(IMAGES_DIR);
  const pngJpgFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${pngJpgFiles.length} PNG/JPG images to optimize\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let converted = 0;
  let skipped = 0;

  for (const file of pngJpgFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

    const stats = fs.statSync(inputPath);
    const sizeKB = stats.size / 1024;

    // Skip small files
    if (sizeKB < MIN_SIZE_KB) {
      console.log(`SKIP: ${file} (${sizeKB.toFixed(1)}KB - too small)`);
      skipped++;
      continue;
    }

    // Skip if WebP already exists and is newer
    if (fs.existsSync(outputPath)) {
      const webpStats = fs.statSync(outputPath);
      if (webpStats.mtimeMs > stats.mtimeMs) {
        console.log(`SKIP: ${file} (WebP already exists)`);
        skipped++;
        continue;
      }
    }

    try {
      await sharp(inputPath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSizeKB = newStats.size / 1024;
      const savings = ((1 - newSizeKB / sizeKB) * 100).toFixed(1);

      console.log(`OK: ${file} (${sizeKB.toFixed(1)}KB -> ${newSizeKB.toFixed(1)}KB, -${savings}%)`);

      totalOriginal += sizeKB;
      totalOptimized += newSizeKB;
      converted++;
    } catch (err) {
      console.error(`ERROR: ${file} - ${err.message}`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Converted: ${converted} images`);
  console.log(`Skipped: ${skipped} images`);
  if (converted > 0) {
    const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log(`Total savings: ${(totalOriginal - totalOptimized).toFixed(1)}KB (-${totalSavings}%)`);
  }

  console.log('\nNote: Update HTML to use <picture> tags for WebP with PNG fallback.');
  console.log('Example:');
  console.log('  <picture>');
  console.log('    <source srcset="images/example.webp" type="image/webp">');
  console.log('    <img src="images/example.png" alt="..." loading="lazy">');
  console.log('  </picture>');
}

optimizeImages().catch(console.error);
