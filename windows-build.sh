#!/bin/bash

# Spàrsh Browser Windows Build Script
echo "🚀 Building Spàrsh Browser for Windows..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Windows
echo "🏗️  Building Windows executable..."
npm run build:win

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Windows installer location: dist/"
    ls -la dist/*.exe 2>/dev/null || echo "   No .exe files found in dist/"

    # Also create portable version if possible
    echo ""
    echo "💡 To create a portable version, you can also run:"
    echo "   npm run build:win -- --win portable"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Windows build complete!"