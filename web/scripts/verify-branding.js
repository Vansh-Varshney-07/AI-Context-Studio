#!/usr/bin/env node
/**
 * Verify branding consistency across the repository
 * Run: node scripts/verify-branding.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const BRANDING_DIR = path.join(REPO_ROOT, 'shared', 'branding');

const REQUIRED_ASSETS = [
  'logo.svg',
  'logo-light.svg',
  'logo-dark.svg',
  'logo-mark.svg',
  'logo-horizontal.svg',
  'logo-vertical.svg',
  'favicon.svg',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'apple-touch-icon.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'social-preview.png',
];

const WEB_PUBLIC = path.join(REPO_ROOT, 'web', 'public');
const DESKTOP_ICONS = path.join(REPO_ROOT, 'desktop', 'src-tauri', 'icons');

let errors = 0;
let warnings = 0;

function checkFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING: ${description} (${filePath})`);
    errors++;
    return false;
  }
  console.log(`✅ Found: ${description}`);
  return true;
}

function checkDir(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ MISSING DIR: ${description} (${dirPath})`);
    errors++;
    return false;
  }
  console.log(`✅ Dir exists: ${description}`);
  return true;
}

console.log('\n=== BRANDING VERIFICATION ===\n');

console.log('--- Shared Branding Directory ---');
checkDir(BRANDING_DIR, 'shared/branding/');

for (const asset of REQUIRED_ASSETS) {
  checkFile(path.join(BRANDING_DIR, asset), `shared/branding/${asset}`);
}

console.log('\n--- Web Public ---');
checkDir(WEB_PUBLIC, 'web/public/');

const WEB_ICONS = [
  'favicon.svg',
  'favicon.ico',
  'icons/favicon-16x16.png',
  'icons/favicon-32x32.png',
  'icons/favicon-48x48.png',
  'icons/apple-touch-icon.png',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'icons/apple.svg',
  'og-image.svg',
];

for (const asset of WEB_ICONS) {
  checkFile(path.join(WEB_PUBLIC, asset), `web/public/${asset}`);
}

console.log('\n--- Desktop Icons ---');
checkDir(DESKTOP_ICONS, 'desktop/src-tauri/icons/');

const DESKTOP_ICONS_LIST = [
  'icon.ico',
  'icon.icns',
  'icon.png',
  '128x128.png',
  '128x128@2x.png',
  '32x32.png',
];

for (const asset of DESKTOP_ICONS_LIST) {
  checkFile(path.join(DESKTOP_ICONS, asset), `desktop/src-tauri/icons/${asset}`);
}

console.log('\n--- Manifest Files ---');
const MANIFESTS = [
  'web/public/manifest.json',
  'web/src/app/manifest.json',
];

for (const manifest of MANIFESTS) {
  checkFile(manifest, manifest);
}

console.log('\n--- Lighthouse Config ---');
checkFile(path.join(REPO_ROOT, 'web', 'lighthouserc.json'), 'web/lighthouserc.json');
checkFile(path.join(REPO_ROOT, 'web', 'lighthouse-budget.json'), 'web/lighthouse-budget.json');

console.log('\n--- Analytics Component ---');
checkFile(path.join(REPO_ROOT, 'web', 'src', 'components', 'analytics.tsx'), 'web/src/components/analytics.tsx');

console.log('\n--- Branding Guide ---');
checkFile(path.join(BRANDING_DIR, 'BRANDING_GUIDE.md'), 'shared/branding/BRANDING_GUIDE.md');
checkFile(path.join(BRANDING_DIR, 'README.md'), 'shared/branding/README.md');

console.log('\n=== SUMMARY ===');
if (errors === 0 && warnings === 0) {
  console.log('\n✅ All branding assets verified successfully!');
  process.exit(0);
} else {
  console.log(`\n❌ ${errors} errors, ${warnings} warnings`);
  process.exit(1);
}