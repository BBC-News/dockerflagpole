#!/usr/bin/env ash

set -e

mkdir -p ~/.docker
aws s3 cp s3://bbc-gnl-docker-secrets/docker-machine.tar.gz ~/docker-machine.tar.gz
rm -rf ~/.docker/machine
tar -xf ~/docker-machine.tar.gz -C ~/.docker
rm ~/docker-machine.tar.gz

echo "eval $(docker-machine env AWS-Docker-CodeBuild --shell ash)" >> ~/.profile