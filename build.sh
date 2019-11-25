#!/usr/bin/env bash
set -e

DOCKER_IMAGE_NAME="dockerflagpole"
DOCKER_IMAGE_VERSION="1.0"
IMAGE=${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}

TARGET=${1}

case ${TARGET} in
    start)  docker container rm --force flagpoles
            docker image build -t ${IMAGE} .
            docker container run --publish 3001:3000 --detach --name flagpoles ${IMAGE} npm run start-test;;
    build) docker image build -t ${IMAGE} .;;
    launch) docker container run --publish 3001:3000 --detach --name flagpoles ${IMAGE};;
    remove) docker container rm --force flagpoles;;
    *) echo "Unknown target : ${TARGET} ... accept ['build', 'launch, 'remove']"
esac


