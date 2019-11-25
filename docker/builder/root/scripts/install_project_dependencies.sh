#!/usr/bin/env ash
set -e
source ~/.profile

cd /root/bbc-gnl-features-pwa

echo "Installing node modules in development mode..."

rm -rf node_modules
yarn install