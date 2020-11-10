#!/bin/bash

npm install
cd backend && docker-compose build
docker-compose up -d
cd ../frontend && npm install
expo start