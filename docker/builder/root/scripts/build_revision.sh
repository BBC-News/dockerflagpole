#!/usr/bin/env ash
set -e

REVISION="${1}"

if [[ -z "${REVISION// }" ]]; then

    echo 'Missing Git revision'
    exit 1

fi

source ~/.profile
DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"

cd /root/bbc-gnl-features-pwa
$DIR/checkout_revision.sh "${REVISION}"