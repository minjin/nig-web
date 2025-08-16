// Cloudflare Worker with R2 Storage
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Default to index.html for root
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }
    
    // Remove leading slash for R2 key
    const objectKey = pathname.substring(1);
    
    try {
      // Try to get the object from R2
      const object = await env.ASSETS_BUCKET.get(objectKey);
      
      if (object === null) {
        // If not found in R2, return 404
        return new Response(`Not Found: ${pathname}`, { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          }
        });
      }
      
      // Get the object body
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      
      // Set content type based on file extension if not already set
      if (!headers.get('content-type')) {
        headers.set('content-type', getContentType(pathname));
      }
      
      // Add cache control
      headers.set('cache-control', 'public, max-age=3600');
      
      // Add CORS headers
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(object.body, {
        headers,
      });
      
    } catch (error) {
      // If R2 is not configured or error occurs, fallback to inline HTML
      if (pathname === '/index.html' || pathname === '/') {
        return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kenshiki — Train to Thrive: Secure AI Tailored for You</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0d0316 0%, #1b0b2a 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            text-align: center;
            max-width: 800px;
        }
        
        h1 {
            font-size: clamp(3rem, 10vw, 5rem);
            font-weight: 900;
            background: linear-gradient(135deg, #d387ff 0%, #8f6da3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
            line-height: 1.1;
        }
        
        .tagline {
            font-size: clamp(1.2rem, 3vw, 1.5rem);
            color: #d387ff;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        p {
            font-size: clamp(1rem, 2vw, 1.25rem);
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .cta-button {
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
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(211, 135, 255, 0.4);
        }
        
        .features {
            margin-top: 4rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }
        
        .feature {
            background: rgba(211, 135, 255, 0.08);
            border: 1px solid rgba(211, 135, 255, 0.2);
            border-radius: 16px;
            padding: 1.5rem;
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .feature h3 {
            color: #d387ff;
            margin-bottom: 0.5rem;
        }
        
        .feature p {
            font-size: 0.9rem;
            margin-bottom: 0;
        }
        
        .error-note {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255, 100, 100, 0.1);
            border: 1px solid rgba(255, 100, 100, 0.3);
            border-radius: 8px;
            font-size: 0.9rem;
            color: rgba(255, 200, 200, 0.9);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Kenshiki</h1>
        <p class="tagline">Train to Thrive: Secure AI Tailored for You</p>
        <p>From revolutionizing industries to redefining possibilities, we're at the forefront of innovation. Join us as we continue to redefine what's possible in the world of AI.</p>
        
        <a href="#" class="cta-button">Explore Innovation</a>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Secure by Design</h3>
                <p>Enterprise-grade security built into every layer</p>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance in milliseconds</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎯</div>
                <h3>Tailored Solutions</h3>
                <p>Custom AI models for your needs</p>
            </div>
        </div>
        
        ${error ? `<div class="error-note">Note: Static assets are being loaded. Full site will be available shortly.<br><small>${error.message}</small></div>` : ''}
    </div>
</body>
</html>
        `, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
          },
        });
      }
      
      return new Response(`Error: ${error.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }
  },
};

function getContentType(pathname) {
  const ext = pathname.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html;charset=UTF-8',
    'css': 'text/css;charset=UTF-8',
    'js': 'application/javascript;charset=UTF-8',
    'mjs': 'application/javascript;charset=UTF-8',
    'json': 'application/json;charset=UTF-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'font/eot',
  };
  return types[ext] || 'application/octet-stream';
}