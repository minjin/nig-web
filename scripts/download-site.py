#!/usr/bin/env python3
import re
import os
import requests
from urllib.parse import urljoin, urlparse
import hashlib

# Base URL and directories
base_url = "https://kind-fact-308747.framer.app/"
output_dir = "/tmp/nig-web/public"

# Create directories
os.makedirs(f"{output_dir}/assets/css", exist_ok=True)
os.makedirs(f"{output_dir}/assets/js", exist_ok=True)
os.makedirs(f"{output_dir}/assets/images", exist_ok=True)
os.makedirs(f"{output_dir}/assets/fonts", exist_ok=True)

# Download main HTML
print("Downloading main HTML...")
response = requests.get(base_url)
html_content = response.text

# Track downloaded resources
downloaded = {}

def download_resource(url, resource_type):
    """Download a resource and return local path"""
    try:
        # Skip if already downloaded
        if url in downloaded:
            return downloaded[url]
        
        # Get the resource
        print(f"Downloading: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Generate filename
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename:
            # Generate filename from URL hash
            filename = hashlib.md5(url.encode()).hexdigest()[:8]
            
        # Add extension if missing
        if '.' not in filename:
            if resource_type == 'css':
                filename += '.css'
            elif resource_type == 'js':
                filename += '.js'
            elif resource_type == 'image':
                # Try to detect from content-type
                content_type = response.headers.get('content-type', '')
                if 'png' in content_type:
                    filename += '.png'
                elif 'jpg' in content_type or 'jpeg' in content_type:
                    filename += '.jpg'
                elif 'svg' in content_type:
                    filename += '.svg'
                else:
                    filename += '.bin'
        
        # Determine local path
        if resource_type == 'css':
            local_path = f"assets/css/{filename}"
            full_path = f"{output_dir}/assets/css/{filename}"
        elif resource_type == 'js':
            local_path = f"assets/js/{filename}"
            full_path = f"{output_dir}/assets/js/{filename}"
        elif resource_type == 'font':
            local_path = f"assets/fonts/{filename}"
            full_path = f"{output_dir}/assets/fonts/{filename}"
        else:
            local_path = f"assets/images/{filename}"
            full_path = f"{output_dir}/assets/images/{filename}"
        
        # Save file
        with open(full_path, 'wb') as f:
            f.write(response.content)
        
        downloaded[url] = local_path
        return local_path
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return url  # Return original URL if download fails

# Extract and download CSS files
print("\nExtracting CSS...")
css_pattern = r'<style[^>]*>([^<]+)</style>'
inline_styles = re.findall(css_pattern, html_content, re.DOTALL)

# Save inline styles to a file
if inline_styles:
    combined_css = '\n'.join(inline_styles)
    with open(f"{output_dir}/assets/css/inline-styles.css", 'w') as f:
        f.write(combined_css)
    # Replace inline styles with link
    html_content = re.sub(css_pattern, '', html_content, flags=re.DOTALL)
    html_content = html_content.replace('</head>', '<link rel="stylesheet" href="assets/css/inline-styles.css">\n</head>')

# Extract and download JavaScript modules
print("\nExtracting JavaScript modules...")
js_modules = re.findall(r'href="([^"]+\.mjs[^"]*)"', html_content)
for js_url in js_modules:
    if not js_url.startswith('http'):
        js_url = urljoin(base_url, js_url)
    local_path = download_resource(js_url, 'js')
    html_content = html_content.replace(js_url, local_path)

# Extract and download script sources
script_srcs = re.findall(r'<script[^>]+src="([^"]+)"', html_content)
for script_url in script_srcs:
    if not script_url.startswith('http'):
        script_url = urljoin(base_url, script_url)
    local_path = download_resource(script_url, 'js')
    html_content = html_content.replace(script_url, local_path)

# Extract and download images
print("\nExtracting images...")
# From img tags
img_srcs = re.findall(r'<img[^>]+src="([^"]+)"', html_content)
for img_url in img_srcs:
    if not img_url.startswith('http'):
        img_url = urljoin(base_url, img_url)
    local_path = download_resource(img_url, 'image')
    html_content = html_content.replace(img_url, local_path)

# From link icons
icon_hrefs = re.findall(r'<link[^>]+rel="icon"[^>]+href="([^"]+)"', html_content)
for icon_url in icon_hrefs:
    if not icon_url.startswith('http'):
        icon_url = urljoin(base_url, icon_url)
    local_path = download_resource(icon_url, 'image')
    html_content = html_content.replace(icon_url, local_path)

# From background images in inline styles
bg_images = re.findall(r'url\(["\']?([^"\')\s]+)["\']?\)', html_content)
for bg_url in bg_images:
    if bg_url.startswith('http'):
        local_path = download_resource(bg_url, 'image')
        html_content = html_content.replace(bg_url, local_path)

# Extract and download fonts
print("\nExtracting fonts...")
font_urls = re.findall(r'url\(([^)]+\.woff2?[^)]*)\)', html_content)
for font_url in font_urls:
    font_url = font_url.strip('"\'')
    if not font_url.startswith('http'):
        font_url = urljoin(base_url, font_url)
    local_path = download_resource(font_url, 'font')
    html_content = html_content.replace(font_url, local_path)

# Special handling for Framer-specific resources
print("\nChecking for Framer resources...")
framer_patterns = [
    r'https://framerusercontent\.com/[^"\s]+',
    r'https://fonts\.gstatic\.com/[^"\s]+',
    r'https://app\.framerstatic\.com/[^"\s]+'
]

for pattern in framer_patterns:
    resources = re.findall(pattern, html_content)
    for resource_url in resources:
        # Determine resource type
        if '.css' in resource_url:
            resource_type = 'css'
        elif '.js' in resource_url or '.mjs' in resource_url:
            resource_type = 'js'
        elif any(ext in resource_url for ext in ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']):
            resource_type = 'image'
        elif any(ext in resource_url for ext in ['.woff', '.woff2', '.ttf', '.eot']):
            resource_type = 'font'
        else:
            resource_type = 'image'  # Default
        
        local_path = download_resource(resource_url, resource_type)
        html_content = html_content.replace(resource_url, local_path)

# Save the modified HTML
print("\nSaving modified HTML...")
with open(f"{output_dir}/index.html", 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"\nDownload complete! Files saved to {output_dir}")
print(f"Total resources downloaded: {len(downloaded)}")