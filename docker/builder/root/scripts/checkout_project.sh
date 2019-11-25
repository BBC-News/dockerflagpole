#!/usr/bin/env ash
source ~/.profile

mkdir /root/bbc-gnl-features-pwa
cd /root/bbc-gnl-features-pwa
git clone git@github.com:bbc/bbc-gnl-features-pwa.git .
git checkout origin/dev
