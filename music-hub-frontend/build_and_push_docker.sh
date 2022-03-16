#!/usr/bin/env bash
npm run ng build -- --configuration=docker
docker build -t andrejos/music-hub-frontend .
docker push andrejos/music-hub-frontend
