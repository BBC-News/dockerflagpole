#!/usr/bin/env ash

set -e

SCRIPT_DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"
source "${SCRIPT_DIR}/runner/repo_config.sh"

show_help() {
cat <<END_HELP

PURPOSE:
Builds and uploads a '${DOCKER_REPOSITORY}' Docker container.

DESCRIPTION:
The -p flag completes the process by pushing the newly-built container to AWS Elastic Container Registry.  This process may require AWS authentication.

USAGE:
  make-runner.sh [-h] [-p]

OPTIONS:
  -h  display this help text
  -p  push tagged container to AWS ECR

END_HELP
}

set -e

# Parse command line:
while getopts "hpr" opt; do
	case $opt in
	h) show_help
		exit;;
	p) PUSH_TO_ECR=1;;
	esac
done

PROJECT_ROOT_DIR="$( cd -- "$( dirname -- "$0" )/.." && pwd -P)"

mkdir -p "${SCRIPT_DIR}/runner/root-folder/etc/pki"
aws secretsmanager get-secret-value --secret-id "bbcDevelopmentTeamPrivateKey" --output text --query 'SecretString' > ${SCRIPT_DIR}/runner/root-folder/etc/pki/bbc-gnl-devteam.key.pem
aws secretsmanager get-secret-value --secret-id "bbcDevelopmentTeamCertificate" --output text --query 'SecretString' > ${SCRIPT_DIR}/runner/root-folder/etc/pki/bbc-gnl-devteam.crt.pem
aws secretsmanager get-secret-value --secret-id "bbcDevelopmentTeamCACert" --output text --query 'SecretString' > ${SCRIPT_DIR}/runner/root-folder/etc/pki/ca-cert.pem

cd "$PROJECT_ROOT_DIR"
npm pack
VERSION=$(exec node -p "require('./package.json').version")
APPLICATION=$(exec node -p "require('./package.json').name")
mv "${PROJECT_ROOT_DIR}/${APPLICATION}-${VERSION}.tgz" "${SCRIPT_DIR}/runner/root-folder/root/application.tgz"

REPO_REVISION=$(git rev-parse HEAD)
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ECR_REVISION_TAG="$TIMESTAMP-$REPO_REVISION"

cd "$SCRIPT_DIR"
docker image build ${SCRIPT_DIR}/runner -t "${S3_IMAGE_NAME}:${ECR_REVISION_TAG}" -t "${DOCKER_REPOSITORY}:latest" -t "${DOCKER_REPOSITORY}:${ECR_REVISION_TAG}" -t "${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest" -t "${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:${ECR_REVISION_TAG}"
rm -f "${SCRIPT_DIR}/runner/root-folder/root/application.tgz"

if [[ ${PUSH_TO_ECR} -eq 1 ]];then

    printf "\n\nPushing Docker image to ECR..."
    eval $(aws ecr get-login --no-include-email --region eu-west-2)

    docker push "${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest"
    docker push "${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:${ECR_REVISION_TAG}"

    printf "\n\n${APPLICATION}:${VERSION}'s ECR docker image [${ECR_REVISION_TAG}] can now be deployed to ECS.\n\nCompressing Docker image for S3 upload..."

    docker image save "${S3_IMAGE_NAME}:${ECR_REVISION_TAG}" -o "${SCRIPT_DIR}/${S3_IMAGE_NAME}.${ECR_REVISION_TAG}.gz"
    aws s3 mv "${SCRIPT_DIR}/${S3_IMAGE_NAME}.${ECR_REVISION_TAG}.gz" "s3://platforms-wwverticals-bbc/artifacts/docker/${S3_IMAGE_NAME}/${S3_IMAGE_NAME}.${ECR_REVISION_TAG}.gz" --only-show-errors

    printf "\n\n${APPLICATION}:${VERSION} can now be deployed to PubStack:\n\n
    [
        \"Name\": \"pwa-frontend\",
        \"ContainerDir\": \"s3://platforms-wwverticals-bbc/artifacts/docker\",
        \"ContainerRepo\": \"${S3_IMAGE_NAME}\",
        \"ContainerTag\": \"${ECR_REVISION_TAG}\",
    ]\n\n"
fi

echo "BUILD SUCCESSFUL. CLEANING-UP DOCKER IMAGES..."

set +e
docker rmi -f $(docker images --format '{{.Repository}}:{{.Tag}}' | grep "${DOCKER_REPOSITORY}:") > /dev/null 2>&1
docker rmi -f $(docker images --format '{{.Repository}}:{{.Tag}}' | grep "${S3_IMAGE_NAME}:") > /dev/null 2>&1
docker rmi -f $(docker images -f "dangling=true" -q) > /dev/null 2>&1
exit 0