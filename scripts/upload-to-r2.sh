#!/bin/bash

# Upload script for R2 bucket
# This script uploads all public assets to Cloudflare R2

echo "Uploading assets to R2 bucket..."

# Upload HTML
echo "Uploading HTML files..."
npx wrangler r2 object put nig-web-assets/index.html --file=public/index.html --content-type="text/html"

# Upload CSS files
echo "Uploading CSS files..."
for file in public/assets/css/*.css; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/css/$filename" --file="$file" --content-type="text/css"
    fi
done

# Upload JavaScript files
echo "Uploading JavaScript files..."
for file in public/assets/js/*.js public/assets/js/*.mjs; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/js/$filename" --file="$file" --content-type="application/javascript"
    fi
done

# Upload JSON files
for file in public/assets/js/*.json; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/js/$filename" --file="$file" --content-type="application/json"
    fi
done

# Upload images
echo "Uploading images..."
for file in public/assets/images/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/images/$filename" --file="$file" --content-type="image/svg+xml"
    fi
done

for file in public/assets/images/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/images/$filename" --file="$file" --content-type="image/png"
    fi
done

for file in public/assets/images/*.jpg public/assets/images/*.jpeg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        npx wrangler r2 object put "nig-web-assets/assets/images/$filename" --file="$file" --content-type="image/jpeg"
    fi
done

echo "Upload complete!"
echo ""
echo "To list uploaded files:"
echo "npx wrangler r2 object list nig-web-assets"