#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"
source "${SCRIPT_DIR}/runner/repo_config.sh"

USAGE_TEXT="Usage: ${0} <PLATFORM> <DOCKER-CONTAINER-TAG>\n\nFor example: ${0} \"test2\" \"20190611-083455-3181a8a57f6ead2f38a93d78f77a2ce37fceb4c0\""
PLATFORM="${1}"
DOCKER_TAG="${2}"

if [[ -z "${PLATFORM// }" ]]; then

    echo -e "Missing PLATFORM to use.\n\n${USAGE_TEXT}"
    exit 1
fi

if [[ -z "${DOCKER_TAG// }" ]]; then

    echo -e "Missing DOCKER-CONTAINER-TAG to run.\n\n${USAGE_TEXT}"
    exit 1
fi

eval $(aws ecr get-login --no-include-email --region eu-west-2)

docker run -p3000:3000 \
    -e NODE_ENV="production" \
    -e PLATFORM="${PLATFORM}" \
    -e HABITATDOMAIN="cachestack-${PLATFORM}-pubstack.bbcverticals.com" \
    -e HABITAT_REQUEST_KEY="JnesnhUFYZLTTgffWS8efzkSLKorzJZN" \
    -ti "${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:${DOCKER_TAG}"