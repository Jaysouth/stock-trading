#!/bin/bash
# Build script for Stock Trading WordPress Plugin

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Plugin details
PLUGIN_SLUG="stock-trading"
PLUGIN_VERSION="1.0.0"
BUILD_DIR="build"
DIST_DIR="dist"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Stock Trading Plugin Build${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Create build directory
echo -e "${YELLOW}Creating build directory...${NC}"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/$PLUGIN_SLUG"
mkdir -p "$DIST_DIR"

# Copy plugin files
echo -e "${YELLOW}Copying plugin files...${NC}"
cp stock-trading-plugin.php "$BUILD_DIR/$PLUGIN_SLUG/"
cp readme.txt "$BUILD_DIR/$PLUGIN_SLUG/"
cp LICENSE "$BUILD_DIR/$PLUGIN_SLUG/" 2>/dev/null || echo "LICENSE file not found, skipping..."

# Copy includes directory
echo -e "${YELLOW}Copying includes...${NC}"
cp -r includes "$BUILD_DIR/$PLUGIN_SLUG/"

# Copy assets directory
echo -e "${YELLOW}Copying assets...${NC}"
cp -r assets "$BUILD_DIR/$PLUGIN_SLUG/"

# Create languages directory
mkdir -p "$BUILD_DIR/$PLUGIN_SLUG/languages"
touch "$BUILD_DIR/$PLUGIN_SLUG/languages/.gitkeep"

# Create ZIP file
echo -e "${YELLOW}Creating ZIP file...${NC}"
cd "$BUILD_DIR"
ZIP_FILE="../$DIST_DIR/${PLUGIN_SLUG}-${PLUGIN_VERSION}.zip"
zip -r "$ZIP_FILE" "$PLUGIN_SLUG" -q

# Go back to root
cd ..

# Get file size
FILE_SIZE=$(du -h "$DIST_DIR/${PLUGIN_SLUG}-${PLUGIN_VERSION}.zip" | cut -f1)

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Plugin ZIP: ${GREEN}$DIST_DIR/${PLUGIN_SLUG}-${PLUGIN_VERSION}.zip${NC}"
echo -e "File Size: ${GREEN}${FILE_SIZE}${NC}"
echo ""
echo -e "${YELLOW}Installation Instructions:${NC}"
echo -e "1. Log in to your WordPress admin panel"
echo -e "2. Go to Plugins > Add New > Upload Plugin"
echo -e "3. Choose the ZIP file: ${PLUGIN_SLUG}-${PLUGIN_VERSION}.zip"
echo -e "4. Click 'Install Now' and then 'Activate Plugin'"
echo ""
echo -e "${GREEN}Done!${NC}"
