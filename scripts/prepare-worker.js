const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, '../public/index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Create the worker content
const workerContent = `
// Auto-generated Worker with embedded HTML
const HTML_CONTENT = ${JSON.stringify(html)};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Serve the main HTML
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
    // Handle assets - try to fetch from public directory
    if (pathname.startsWith('/assets/')) {
      // For now, return 404 for assets
      // In production, these would be served from KV or R2
      return new Response('Asset not found', { status: 404 });
    }
    
    // Default 404
    return new Response('Not Found', { status: 404 });
  },
};
`;

// Write the worker file
const workerPath = path.join(__dirname, '../src/worker-generated.js');
fs.writeFileSync(workerPath, workerContent);

console.log('Worker generated successfully!');
console.log(`HTML size: ${(html.length / 1024).toFixed(2)} KB`);