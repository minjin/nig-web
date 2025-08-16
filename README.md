# Kenshiki Website

A modern, high-performance website for Kenshiki AI, optimized for deployment on Cloudflare Workers.

## Features

- ⚡ Ultra-fast edge deployment via Cloudflare Workers
- 🎨 Modern gradient design with purple theme
- 📱 Fully responsive layout
- 🔒 Secure by default
- 🚀 Optimized for performance

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your Cloudflare account:
   - Update `wrangler.toml` with your KV namespace IDs
   - Set up your Cloudflare account credentials

3. Development:
```bash
npm run dev
```

4. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Domain

This website is configured to run on `kenshiki.jp`

## Technology Stack

- Cloudflare Workers for edge computing
- KV storage for caching
- Modern JavaScript (ES6+)
- Responsive CSS with gradient designs

## License

© 2024 Kenshiki. All rights reserved.