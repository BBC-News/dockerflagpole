#!/usr/bin/env ash

curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py --user
echo 'export PATH=~/.local/bin:$PATH' >> ~/.profile

source ~/.profile

pip install awscli --upgrade --user
