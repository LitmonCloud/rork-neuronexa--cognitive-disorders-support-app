#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REQUIRED_ASSETS = [
  {
    path: 'assets/images/icon.png',
    minWidth: 1024,
    minHeight: 1024,
    exactWidth: 1024,
    exactHeight: 1024,
    description: 'App icon (must be 1024x1024, opaque)',
  },
  {
    path: 'assets/images/splash-icon.png',
    minWidth: 1242,
    minHeight: 2436,
    description: 'Splash screen icon (minimum 1242x2436)',
  },
  {
    path: 'assets/images/adaptive-icon.png',
    minWidth: 432,
    minHeight: 432,
    exactWidth: 432,
    exactHeight: 432,
    description: 'Android adaptive icon foreground (must be 432x432)',
  },
  {
    path: 'assets/images/favicon.png',
    minWidth: 180,
    minHeight: 180,
    exactWidth: 180,
    exactHeight: 180,
    description: 'Web favicon (must be 180x180)',
  },
];

console.log('🔍 Validating Nexa assets...\n');

let hasErrors = false;
let warnings = [];

REQUIRED_ASSETS.forEach((asset) => {
  const fullPath = path.join(process.cwd(), asset.path);
  
  console.log(`Checking: ${asset.path}`);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`  ❌ File not found`);
    hasErrors = true;
    return;
  }
  
  const stats = fs.statSync(fullPath);
  console.log(`  ✅ File exists (${(stats.size / 1024).toFixed(2)} KB)`);
  
  if (asset.exactWidth && asset.exactHeight) {
    console.log(`  ℹ️  Expected dimensions: ${asset.exactWidth}x${asset.exactHeight}`);
  } else if (asset.minWidth && asset.minHeight) {
    console.log(`  ℹ️  Minimum dimensions: ${asset.minWidth}x${asset.minHeight}`);
  }
  
  console.log(`  📝 ${asset.description}\n`);
});

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach((warning) => console.log(`  - ${warning}`));
}

if (hasErrors) {
  console.error('\n❌ Asset validation failed. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All required assets are present!');
  console.log('\n📝 Note: This script only checks file existence and basic info.');
  console.log('   For detailed dimension validation, use an image processing library.');
  console.log('   You can manually verify dimensions using:');
  console.log('   - macOS: Preview > Tools > Show Inspector');
  console.log('   - Windows: Right-click > Properties > Details');
  console.log('   - Linux: file command or image viewer\n');
  process.exit(0);
}
