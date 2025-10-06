#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Building Spàrsh Browser for Windows...\n');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build for Windows
  console.log('\n🔨 Building Windows executable...');
  execSync('npm run build:win', { stdio: 'inherit' });

  // Check if build was successful
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    console.log('\n✅ Windows build completed successfully!');
    console.log(`📁 Build files are in: ${distPath}`);
    
    // List build files
    const files = fs.readdirSync(distPath);
    console.log('\n📋 Generated files:');
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`   ${file} (${size} MB)`);
    });
  } else {
    console.log('\n❌ Build failed - dist directory not found');
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}