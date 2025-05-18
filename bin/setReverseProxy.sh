#!/bin/bash

set -e

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/reverseProxyConfig"
NGINX_AVAILABLE="/etc/nginx/sites-available/reverse-proxy"
NGINX_ENABLED="/etc/nginx/sites-enabled/reverse-proxy"

echo "🚀 Starting Nginx reverse proxy setup..."

# 1. Install Nginx if not installed
if ! command -v nginx >/dev/null 2>&1; then
    echo "📦 Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "✅ Nginx is already installed."
fi

# 2. Verify reverseProxyConfig file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: '$CONFIG_FILE' not found."
    echo "   Please place your reverse proxy config in a file named 'reverseProxyConfig' next to this script."
    exit 1
fi

# 3. Create or update reverse proxy config
if [ ! -f "$NGINX_AVAILABLE" ]; then
    echo "📝 Creating reverse proxy config at $NGINX_AVAILABLE..."
    sudo cp "$CONFIG_FILE" "$NGINX_AVAILABLE"
else
    if cmp -s "$CONFIG_FILE" "$NGINX_AVAILABLE"; then
        echo "✅ Reverse proxy config already exists and matches."
    else
        echo "🔁 Updating existing reverse proxy config..."
        sudo cp "$CONFIG_FILE" "$NGINX_AVAILABLE"
    fi
fi

# 4. Enable reverse proxy site
if [ ! -L "$NGINX_ENABLED" ]; then
    echo "🔗 Enabling reverse proxy site..."
    sudo ln -s "$NGINX_AVAILABLE" "$NGINX_ENABLED"
else
    echo "✅ Reverse proxy site already enabled."
fi

# 5. Disable default Nginx site
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🧹 Disabling default Nginx site..."
    sudo rm -f /etc/nginx/sites-enabled/default
else
    echo "✅ Default site already disabled."
fi

# 6. Test Nginx configuration
echo "🔍 Testing Nginx config..."
sudo nginx -t

# 7. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# 8. Verify Express is running on port 3000
if sudo lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Express app is running on port 3000."
else
    echo "⚠️ Warning: Express app is NOT running on port 3000."
    echo "   Please start your app to access it via the reverse proxy."
fi

echo "✅ Nginx reverse proxy setup complete."
