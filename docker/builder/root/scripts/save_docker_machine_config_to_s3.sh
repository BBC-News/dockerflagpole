#!/usr/bin/env ash

set -e

tar -czpf ~/docker-machine.tar.gz -C ~/.docker machine
aws s3 cp ~/docker-machine.tar.gz s3://bbc-gnl-docker-secrets
rm ~/docker-machine.tar.gz