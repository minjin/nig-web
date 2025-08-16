# Kenshiki Website

A modern, high-performance website for Kenshiki AI, deployed on Cloudflare Workers with R2 storage.

## Features

- ⚡ Ultra-fast edge deployment via Cloudflare Workers
- 🗄️ Static assets stored in Cloudflare R2
- 🎨 Complete copy of the original Framer site
- 📱 Fully responsive layout
- 🔒 Secure by default
- 🚀 Optimized for performance

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create R2 Bucket

First, create an R2 bucket in your Cloudflare dashboard or via CLI:
```bash
npx wrangler r2 bucket create nig-web-assets
```

### 3. Upload assets to R2

Run the upload script to copy all assets to R2:
```bash
./scripts/upload-to-r2.sh
```

Or manually upload specific files:
```bash
npx wrangler r2 object put nig-web-assets/index.html --file=public/index.html
```

### 4. Deploy the Worker

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

Or for development:
```bash
npm run dev
```

## File Structure

```
/public/
  ├── index.html              # Main HTML file
  ├── assets/
      ├── css/               # Stylesheets
      ├── js/                # JavaScript modules
      └── images/            # Images and icons
```

## R2 Configuration

The Worker is configured to serve files from the R2 bucket `nig-web-assets`. The bucket binding is configured in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "ASSETS_BUCKET"
bucket_name = "nig-web-assets"
```

## Domain

This website is configured to run on `kenshiki.jp`

## Scripts

- `scripts/download-site.py` - Downloads all assets from the original Framer site
- `scripts/upload-to-r2.sh` - Uploads all assets to R2 bucket
- `scripts/prepare-worker.js` - Generates worker with embedded HTML (alternative approach)

## Technology Stack

- Cloudflare Workers for edge computing
- Cloudflare R2 for object storage
- Modern JavaScript (ES6+)
- Responsive CSS with gradient designs

## License

© 2024 Kenshiki. All rights reserved.