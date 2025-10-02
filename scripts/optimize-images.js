#!/usr/bin/env node
/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

console.log('🖼️  NeuroNexa Image Optimization Script\n');
console.log('This script helps identify images that may need optimization.\n');

const assetsDir = path.join(__dirname, '..', 'assets', 'images');

const recommendations = [
  {
    title: 'Image Optimization Tools',
    items: [
      '• ImageOptim (Mac): https://imageoptim.com/',
      '• TinyPNG: https://tinypng.com/',
      '• Squoosh: https://squoosh.app/',
      '• Sharp CLI: npm install -g sharp-cli'
    ]
  },
  {
    title: 'Optimization Guidelines',
    items: [
      '• App icons should be PNG with no transparency',
      '• Splash screens should be optimized but maintain quality',
      '• Use WebP format for web when possible',
      '• Compress images to reduce app bundle size',
      '• Target: <100KB for most images, <500KB for splash screens'
    ]
  },
  {
    title: 'Required Assets',
    items: [
      '• icon.png (1024×1024, opaque)',
      '• splash-icon.png (≥1242×2436)',
      '• adaptive-icon.png (432×432)',
      '• favicon.png (180×180)',
      '• notification-icon.png (96×96, Android)'
    ]
  }
];

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}\n`);
    return [];
  }

  const files = fs.readdirSync(dir);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg|webp)$/i.test(file)
  );

  return imageFiles.map(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    return {
      name: file,
      path: filePath,
      size: stats.size,
      sizeKB: sizeKB,
      needsOptimization: stats.size > 500 * 1024
    };
  });
}

console.log('📁 Scanning assets directory...\n');

const images = checkDirectory(assetsDir);

if (images.length === 0) {
  console.log('❌ No images found in assets/images/\n');
} else {
  console.log('📊 Image Analysis:\n');
  
  images.forEach(img => {
    const status = img.needsOptimization ? '⚠️  LARGE' : '✅ OK';
    console.log(`${status} ${img.name}`);
    console.log(`   Size: ${img.sizeKB} KB`);
    if (img.needsOptimization) {
      console.log(`   ⚠️  Consider optimizing (>500KB)`);
    }
    console.log('');
  });

  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📦 Total size: ${totalSizeMB} MB\n`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

recommendations.forEach(section => {
  console.log(`📌 ${section.title}:\n`);
  section.items.forEach(item => console.log(`   ${item}`));
  console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 Quick Optimization Commands:\n');
console.log('   # Using ImageOptim (Mac)');
console.log('   open -a ImageOptim assets/images/*.png\n');
console.log('   # Using TinyPNG CLI (requires API key)');
console.log('   tinypng assets/images/*.png\n');
console.log('   # Using Sharp CLI');
console.log('   sharp -i assets/images/icon.png -o assets/images/icon-optimized.png\n');

console.log('✅ Image optimization scan complete!\n');
