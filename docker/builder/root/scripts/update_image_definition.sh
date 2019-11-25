#!/usr/bin/env ash
source ~/.profile
DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"
source ${DIR}/repo_config.sh

ECR_URL="${DOCKER_REPOSITORY_DOMAIN}/${DOCKER_REPOSITORY}"
REVISION="${1}"
BRANCH_NAME="${2}"

if [[ -z "${REVISION// }" ]]; then

    echo 'Missing Git revision'
    exit 2

fi

if [[ -z "${BRANCH_NAME// }" ]]; then

    echo 'Missing branch name'
    exit 3

fi

TEMPLATE_FILE_NAME="bbc-reel-frontend-codepipeline-imagedefinition-template.json"
TEMPORARY_FILE_NAME="imagedefinition.json"
OUTPUT_FILENAME="bbc-reel-frontend-${BRANCH_NAME}-imagedefinition.zip"
DOCKER_IMAGE_URL=$(echo "${ECR_URL}:${REVISION}")

aws s3 cp s3://bbc-gnl-docker-container-image-definitions/${TEMPLATE_FILE_NAME} ${DIR}

cat ${DIR}/bbc-reel-frontend-codepipeline-imagedefinition-template.json \
    | jq ".[] | . as \$parent | .name | match(\"ReelFrontend\"; \"ig\") | \$parent | .imageUri=\"${DOCKER_IMAGE_URL}\" " \
    > ${DIR}/${TEMPORARY_FILE_NAME}


rm ${DIR}/bbc-reel-frontend-master-imagedefinition.zip
zip -9j ${DIR}/bbc-reel-frontend-master-imagedefinition.zip ${DIR}/${TEMPORARY_FILE_NAME}
aws s3 cp ${DIR}/bbc-reel-frontend-master-imagedefinition.zip s3://bbc-gnl-docker-container-image-definitions/${OUTPUT_FILENAME}

rm ${DIR}/${TEMPLATE_FILE_NAME}
rm ${DIR}/${TEMPORARY_FILE_NAME}
rm ${DIR}/${OUTPUT_FILENAME}


