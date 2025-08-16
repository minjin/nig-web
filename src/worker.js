// Cloudflare Worker - Proxy to original Framer site
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Create the target URL for the original Framer site
    const targetUrl = new URL(url.pathname + url.search, 'https://kind-fact-308747.framer.app');
    
    // Create a new request with the same method, headers, and body
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // Fetch from the original site
    const response = await fetch(modifiedRequest);
    
    // Clone the response to modify headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
    
    // Add CORS headers if needed
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    // Cache the response for better performance
    const cacheControl = response.headers.get('Cache-Control');
    if (!cacheControl) {
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=3600');
    }
    
    return modifiedResponse;
  },
};