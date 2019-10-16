#!/bin/bash
DOCKER_IMAGE_NAME="dockerflagpole"
DOCKER_IMAGE_VERSION="1.0"
DOCKER_PORT="3000"
LOCAL_PORT="3000"
IMAGE=${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}

TARGET=${1}

case ${TARGET} in
    build) docker image build -t ${IMAGE} .;;
    launch) docker container run --publish ${LOCAL_PORT}:${DOCKER_PORT} --detach --name bb ${IMAGE};;
    remove) docker container rm --force bb;;
    *) echo "Unknown target : ${TARGET}"
esac


