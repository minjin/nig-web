// Cloudflare Worker entry point
export default {
  async fetch(request, env, ctx) {
    const html = getOptimizedHTML();
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};

function getOptimizedHTML() {
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kenshiki — Train to Thrive: Secure AI Tailored for You</title>
    <meta name="description" content="From revolutionizing industries to redefining possibilities, we're at the forefront of innovation. Join us as we continue to redefine what's possible in the world of AI.">
    <link rel="icon" href="/assets/favicon.png">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Kenshiki — Train to Thrive: Secure AI Tailored for You">
    <meta property="og:description" content="From revolutionizing industries to redefining possibilities, we're at the forefront of innovation.">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Kenshiki — Train to Thrive: Secure AI Tailored for You">
    
    <style>
      /* Critical CSS inline for fast initial paint */
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
        overflow-x: hidden;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Hero Section */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: radial-gradient(circle at 50% 50%, rgba(211, 135, 255, 0.1) 0%, transparent 70%);
      }
      
      .hero-content {
        text-align: center;
        z-index: 1;
      }
      
      .hero h1 {
        font-size: clamp(2.5rem, 8vw, 5rem);
        font-weight: 900;
        background: linear-gradient(135deg, #d387ff 0%, #8f6da3 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }
      
      .hero p {
        font-size: clamp(1rem, 3vw, 1.5rem);
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
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
      
      /* Features Section */
      .features {
        padding: 5rem 0;
        background: rgba(13, 3, 22, 0.5);
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
      }
      
      .feature-card {
        background: rgba(211, 135, 255, 0.08);
        border: 1px solid rgba(211, 135, 255, 0.2);
        border-radius: 16px;
        padding: 2rem;
        transition: transform 0.3s ease, background 0.3s ease;
      }
      
      .feature-card:hover {
        transform: translateY(-5px);
        background: rgba(211, 135, 255, 0.12);
      }
      
      .feature-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #d387ff 0%, #8353a1 100%);
        border-radius: 12px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .feature-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #d387ff;
      }
      
      .feature-card p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
      }
      
      /* Footer */
      .footer {
        padding: 3rem 0;
        text-align: center;
        border-top: 1px solid rgba(211, 135, 255, 0.2);
        background: rgba(13, 3, 22, 0.8);
      }
      
      .footer p {
        color: rgba(255, 255, 255, 0.6);
      }
      
      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in {
        animation: fadeIn 0.8s ease forwards;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .hero {
          padding: 2rem 0;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <div class="hero-content fade-in">
                <h1>Kenshiki</h1>
                <p>Train to Thrive: Secure AI Tailored for You</p>
                <p>From revolutionizing industries to redefining possibilities, we're at the forefront of innovation.</p>
                <a href="#features" class="cta-button">Explore Innovation</a>
            </div>
        </div>
    </section>
    
    <section id="features" class="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem; color: #d387ff;">
                Redefining AI Excellence
            </h2>
            <p style="text-align: center; color: rgba(255, 255, 255, 0.7); max-width: 600px; margin: 0 auto;">
                Join us as we continue to redefine what's possible in the world of AI
            </p>
            
            <div class="features-grid">
                <div class="feature-card fade-in">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure by Design</h3>
                    <p>Enterprise-grade security built into every layer of our AI infrastructure, ensuring your data remains protected.</p>
                </div>
                
                <div class="feature-card fade-in">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Optimized performance that delivers results in milliseconds, powered by cutting-edge technology.</p>
                </div>
                
                <div class="feature-card fade-in">
                    <div class="feature-icon">🎯</div>
                    <h3>Tailored Solutions</h3>
                    <p>Custom AI models designed specifically for your unique business needs and objectives.</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Kenshiki. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card').forEach(el => {
            observer.observe(el);
        });
    </script>
</body>
</html>`;
}