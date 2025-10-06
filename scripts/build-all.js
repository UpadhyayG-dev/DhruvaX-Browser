#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Spàrsh Browser for all platforms...\n');

const platforms = [
  { name: 'Windows', script: 'build-windows.js' },
  { name: 'Android', script: 'build-android.js' }
];

let successCount = 0;
let totalCount = platforms.length;

for (const platform of platforms) {
  try {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔨 Building for ${platform.name}...`);
    console.log(`${'='.repeat(50)}\n`);
    
    execSync(`node scripts/${platform.script}`, { stdio: 'inherit' });
    successCount++;
    
    console.log(`\n✅ ${platform.name} build completed successfully!`);
    
  } catch (error) {
    console.error(`\n❌ ${platform.name} build failed:`, error.message);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log('📊 Build Summary');
console.log(`${'='.repeat(50)}`);
console.log(`✅ Successful: ${successCount}/${totalCount}`);
console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);

if (successCount === totalCount) {
  console.log('\n🎉 All builds completed successfully!');
  console.log('\n📁 Build files are available in:');
  console.log('   - Windows: ./dist/');
  console.log('   - Android: ./android/app/build/outputs/apk/');
} else {
  console.log('\n⚠️  Some builds failed. Check the logs above for details.');
  process.exit(1);
}