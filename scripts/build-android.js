#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Building Spàrsh Browser for Android...\n');

try {
  // Check if Android SDK is available
  console.log('🔍 Checking Android SDK...');
  try {
    execSync('adb version', { stdio: 'pipe' });
    console.log('✅ Android SDK found');
  } catch (error) {
    console.log('⚠️  Android SDK not found. Please install Android Studio and set up the SDK.');
  }

  // Navigate to Android directory
  const androidPath = path.join(__dirname, '..', 'android');
  if (!fs.existsSync(androidPath)) {
    console.log('❌ Android directory not found');
    process.exit(1);
  }

  process.chdir(androidPath);

  // Clean previous builds
  console.log('\n🧹 Cleaning previous builds...');
  execSync('./gradlew clean', { stdio: 'inherit' });

  // Build debug APK
  console.log('\n🔨 Building debug APK...');
  execSync('./gradlew assembleDebug', { stdio: 'inherit' });

  // Build release APK
  console.log('\n🔨 Building release APK...');
  execSync('./gradlew assembleRelease', { stdio: 'inherit' });

  // Check if builds were successful
  const debugApk = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const releaseApk = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');

  console.log('\n✅ Android build completed successfully!');
  
  if (fs.existsSync(debugApk)) {
    const stats = fs.statSync(debugApk);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📱 Debug APK: ${debugApk} (${size} MB)`);
  }

  if (fs.existsSync(releaseApk)) {
    const stats = fs.statSync(releaseApk);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📱 Release APK: ${releaseApk} (${size} MB)`);
  }

} catch (error) {
  console.error('\n❌ Android build failed:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('   - Android Studio installed');
  console.log('   - Android SDK configured');
  console.log('   - JAVA_HOME environment variable set');
  process.exit(1);
}