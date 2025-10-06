#!/bin/bash

# Spàrsh Browser Android Build Script
echo "🚀 Building Spàrsh Browser for Android..."

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "📦 Installing Cordova..."
    npm install -g cordova
fi

# Check if Android platform is added
if [ ! -d "platforms/android" ]; then
    echo "📱 Adding Android platform..."
    cordova platform add android
fi

# Install required plugins
echo "🔧 Installing plugins..."
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-device

# Build the Android APK
echo "🏗️  Building Android APK..."
cordova build android

# Check if build was successful
if [ -f "platforms/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: platforms/android/app/build/outputs/apk/debug/app-debug.apk"

    # Create release build
    echo "📦 Creating release build..."
    cordova build android --release

    if [ -f "platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
        echo "✅ Release build successful!"
        echo "📱 Release APK location: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
        echo ""
        echo "🔐 To sign the APK for Play Store:"
        echo "   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name"
        echo ""
        echo "📦 To create APK bundle:"
        echo "   ${ANDROID_HOME}/build-tools/*/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk SparshBrowser.apk"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Android build complete!"