#!/usr/bin/env bash

npm run start-dev &

npm run cypress-dev-run
RES=$?

trap "pkill -9 node; echo 'Result -->>>> $RES'" EXIT

