#!/bin/bash

# Usage: ./enable_nginx_site.sh my-site.conf

SITE_NAME="$1"

if [[ -z "$SITE_NAME" ]]; then
  echo "Usage: $0 <site-config-filename>"
  exit 1
fi

AVAILABLE_DIR="/etc/nginx/sites-available"
ENABLED_DIR="/etc/nginx/sites-enabled"
SITE_PATH="$AVAILABLE_DIR/$SITE_NAME"

# Check if site config exists
if [[ ! -f "$SITE_PATH" ]]; then
  echo "Error: Site config '$SITE_NAME' does not exist in $AVAILABLE_DIR"
  exit 1
fi

# Disable all other sites
echo "Disabling all enabled sites..."
sudo rm -f $ENABLED_DIR/*

# Enable the selected site
echo "Enabling site '$SITE_NAME'..."
sudo ln -s "$SITE_PATH" "$ENABLED_DIR/$SITE_NAME"

# Test NGINX configuration
echo "Testing NGINX configuration..."
if ! sudo nginx -t; then
  echo "Error: NGINX configuration test failed."
  exit 1
fi

# Reload NGINX
echo "Reloading NGINX..."
sudo systemctl reload nginx

echo "Site '$SITE_NAME' is now enabled. All others disabled."
