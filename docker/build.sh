#!/usr/bin/env bash
set -e

REVISION="${1}"

if [[ -z "${REVISION// }" ]]; then

    echo 'Missing Git revision to build'
    exit 1

fi

DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"
source ${DIR}/builder/root-folder/root/scripts/repo_config.sh

eval $(aws ecr get-login --region "eu-west-2" --no-include-email)
docker pull ${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest
docker run ${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest /root/scripts/build_and_distribute.sh "${REVISION}"
