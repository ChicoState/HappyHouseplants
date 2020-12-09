#!/bin/bash

curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[XX-XXXXXXXXXX]",
  "title":"hello",
  "body": "world"
}'