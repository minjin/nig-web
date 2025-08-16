import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Cloudflare Worker for serving static site
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Serve static assets from KV
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
        }
      );
      
      // Add cache headers
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=3600');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (e) {
      // If asset not found, try to serve index.html for SPA routing
      if (e.status === 404) {
        try {
          const indexResponse = await getAssetFromKV(
            {
              request: new Request(new URL('/index.html', request.url)),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
            }
          );
          
          return new Response(indexResponse.body, {
            status: 200,
            headers: indexResponse.headers,
          });
        } catch {
          return new Response('Not Found', { status: 404 });
        }
      }
      
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};