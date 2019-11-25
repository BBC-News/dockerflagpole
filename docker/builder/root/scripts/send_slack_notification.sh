#!/usr/bin/env ash
set -e

MESSAGE="${1}"

if [[ -z "${MESSAGE// }" ]]; then
    echo 'Missing message'
    exit 1
fi

source ~/.profile

NOTIFICATION_URL=$(aws secretsmanager get-secret-value --secret-id "CI-SLACK-WEBHOOK-URL" --output text --query 'SecretString')

curl -X POST --data-urlencode "payload={\"text\": \"${MESSAGE}\", \"icon_emoji\": \":ghost:\"}" ${NOTIFICATION_URL}
