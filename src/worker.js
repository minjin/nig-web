// Cloudflare Worker - Serves the complete Framer site
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // For the main page, fetch from the original Framer site
    // This ensures we always have the latest content
    if (pathname === '/' || pathname === '/index.html') {
      try {
        // Fetch the original page
        const response = await fetch('https://kind-fact-308747.framer.app/');
        const html = await response.text();
        
        // Return the HTML with proper headers
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        // Fallback to a basic page if fetch fails
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Kenshiki</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #0d0316 0%, #1b0b2a 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
              }
              .container {
                text-align: center;
                max-width: 600px;
              }
              h1 {
                background: linear-gradient(135deg, #d387ff 0%, #8f6da3 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: clamp(2.5rem, 8vw, 4rem);
                margin-bottom: 1rem;
                font-weight: 900;
              }
              p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.25rem;
                line-height: 1.6;
                margin-bottom: 2rem;
              }
              .tagline {
                color: rgba(211, 135, 255, 0.9);
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 1rem;
              }
              .cta {
                display: inline-block;
                padding: 1rem 2.5rem;
                background: linear-gradient(135deg, #d387ff 0%, #8353a1 100%);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1.1rem;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                box-shadow: 0 10px 30px rgba(211, 135, 255, 0.3);
              }
              .cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(211, 135, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Kenshiki</h1>
              <p class="tagline">Train to Thrive: Secure AI Tailored for You</p>
              <p>From revolutionizing industries to redefining possibilities, we're at the forefront of innovation. Join us as we continue to redefine what's possible in the world of AI.</p>
              <a href="mailto:contact@kenshiki.jp" class="cta">Get Started</a>
            </div>
          </body>
          </html>
        `, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
          },
        });
      }
    }
    
    // For other assets, proxy to the original site
    if (pathname.startsWith('/assets/') || 
        pathname.endsWith('.css') || 
        pathname.endsWith('.js') || 
        pathname.endsWith('.mjs') ||
        pathname.endsWith('.json') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg')) {
      
      const targetUrl = `https://kind-fact-308747.framer.app${pathname}`;
      const response = await fetch(targetUrl);
      
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    }
    
    // Default 404
    return new Response('Not Found', { status: 404 });
  },
};