#!/usr/bin/env bash

set -e

DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"
source ${DIR}/builder/root-folder/root/scripts/repo_config.sh

# End of editable stuff.

show_help() {
cat <<END_HELP

PURPOSE:
Builds and uploads a '${DOCKER_REPOSITORY}' Builder.

DESCRIPTION:
The -p flag completes the process by pushing the newly-built container to AWS Elastic Container Registry.  This process may require AWS authentication.

USAGE:
  make-runner.sh [-h] [-p]

OPTIONS:
  -h  display this help text
  -p  push tagged nginx container to AWS ECR

END_HELP
}


# Parse command line:
while getopts "hp" opt; do
	case $opt in
	h) show_help
		exit;;
	p) PUSH_TO_ECR=1;;
	esac
done

rm -rf ${DIR}/builder/root-folder/root/.aws
rm -rf ${DIR}/builder/root-folder/root/.ssh
mkdir -p ${DIR}/builder/root-folder/root/.aws
mkdir -p ${DIR}/builder/root-folder/root/.ssh

aws secretsmanager get-secret-value --region "eu-west-2" --secret-id "CI-AWS-CONFIG"      --output text --query 'SecretString' > ${DIR}/builder/root-folder/root/.aws/config
aws secretsmanager get-secret-value --region "eu-west-2" --secret-id "CI-AWS-CREDENTIALS" --output text --query 'SecretString' > ${DIR}/builder/root-folder/root/.aws/credentials
aws secretsmanager get-secret-value --region "eu-west-2" --secret-id "bbcGithubAccessPrivateKey" --output text --query 'SecretString' > ${DIR}/builder/root-folder/root/.ssh/github_access.key

NPM_TOKEN=$(aws secretsmanager --region eu-west-2 get-secret-value --secret-id "CI-NPM-Auth-Token" --output text --query 'SecretString')
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ${DIR}/builder/root-folder/root/.npmrc
echo "export NPM_TOKEN=\"${NPM_TOKEN}\"" > ${DIR}/builder/root-folder/root/.profile

docker image build -t ${DOCKER_REPOSITORY} $DIR/builder/
docker tag ${DOCKER_REPOSITORY}:latest ${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest

if [[ $PUSH_TO_ECR -eq 1 ]];then
    `aws ecr get-login --no-include-email --region eu-west-2`
    docker push ${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}:latest
fi