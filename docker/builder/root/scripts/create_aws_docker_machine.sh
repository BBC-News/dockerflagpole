#!/usr/bin/env ash

docker-machine create --driver amazonec2 --amazonec2-region eu-west-2 --amazonec2-instance-type t2.small --engine-opt experimental=true AWS-Docker-CodeBuild