#!/usr/bin/env ash

REVISION="${1}"

if [[ -z "${REVISION// }" ]]; then

    echo 'Missing Git revision'
    exit 1

fi

source ~/.profile

DIR="$( cd -- "$( dirname -- "$0" )" && pwd -P)"

set -e

$DIR/build_revision.sh "${REVISION}"
$DIR/run_integration_tests.sh
$DIR/distribute_runner.sh -p