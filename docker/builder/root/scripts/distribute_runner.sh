#!/usr/bin/env ash
source ~/.profile
DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"

set -e

${DIR}/restore_docker_machine_config_from_s3.sh
eval $(docker-machine env AWS-Docker-CodeBuild --shell ash)
/root/bbc-gnl-features-pwa/docker/make-runner.sh -p
