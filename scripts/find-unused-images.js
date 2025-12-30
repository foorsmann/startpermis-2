#!/usr/bin/env node
/**
 * Find unused images in the project
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const ROOT_DIR = path.join(__dirname, '..');

// Get all image files
const imageFiles = fs.readdirSync(IMAGES_DIR);

// Read all HTML and CSS files
const htmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));
const cssFiles = fs.readdirSync(path.join(ROOT_DIR, 'css')).filter(f => f.endsWith('.css'));

let allContent = '';

// Read HTML files
htmlFiles.forEach(file => {
  allContent += fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
});

// Read CSS files
cssFiles.forEach(file => {
  allContent += fs.readFileSync(path.join(ROOT_DIR, 'css', file), 'utf8');
});

// Find unused images
const unused = [];
let totalSize = 0;

imageFiles.forEach(img => {
  if (!allContent.includes(img)) {
    const stats = fs.statSync(path.join(IMAGES_DIR, img));
    const sizeKB = (stats.size / 1024).toFixed(1);
    unused.push({ name: img, size: stats.size, sizeKB });
    totalSize += stats.size;
  }
});

// Sort by size descending
unused.sort((a, b) => b.size - a.size);

console.log(`\nFound ${unused.length} unused images (${(totalSize / 1024).toFixed(1)} KB total):\n`);
unused.forEach(img => {
  console.log(`  ${img.name} (${img.sizeKB} KB)`);
});

if (unused.length > 0) {
  console.log('\nTo delete these files, run:');
  console.log('  node scripts/find-unused-images.js --delete');

  if (process.argv.includes('--delete')) {
    console.log('\nDeleting unused images...');
    unused.forEach(img => {
      fs.unlinkSync(path.join(IMAGES_DIR, img.name));
      console.log(`  Deleted: ${img.name}`);
    });
    console.log('\nDone!');
  }
}
