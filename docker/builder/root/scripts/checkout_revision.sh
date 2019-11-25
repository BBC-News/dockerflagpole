#!/usr/bin/env ash
SCRIPT_DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"

set -e

source ~/.profile
REVISION="${1}"

if [[ -z "${REVISION// }" ]]; then

    echo 'Missing Git revision'
    exit 1

fi

git fetch origin "${REVISION}"

echo "git checkout ${REVISION}"
git checkout -f "${REVISION}"

echo "${REVISION}" > $SCRIPT_DIR/.runner_build_revision
git name-rev "${REVISION}" | egrep -o "[^\/~]+(~)*[^\/]*$" | egrep -o "^[^\/~]+" > $SCRIPT_DIR/.runner_build_branch