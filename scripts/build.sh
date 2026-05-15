#!/usr/bin/env bash
set -euo pipefail

echo "═══ CogniFlow Build Script ═══"
echo ""

# Build desktop app
echo "▸ Building desktop app..."
cd "$(dirname "$0")/../app"

echo "  Installing npm dependencies..."
npm install

echo "  Building frontend..."
npm run build

echo "  Building Tauri app (this may take a while)..."
npm run tauri build

echo ""
echo "✓ Desktop app built!"

# Build website
echo ""
echo "▸ Building website..."
cd "$(dirname "$0")/../website"

echo "  Installing npm dependencies..."
npm install

echo "  Building website..."
npm run build

echo ""
echo "✓ Website built!"
echo ""
echo "═══ Build Complete ═══"
echo ""
echo "Desktop app: app/src-tauri/target/release/bundle/"
echo "Website:     website/out/"
