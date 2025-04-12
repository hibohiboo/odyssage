#!/bin/bash

bin_dir=$(cd $(dirname $0) && pwd)

IMAGE_NAME=ubuntu24-firebase-tools

source $bin_dir/.env

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

cd $bin_dir/../docker && docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME $DOCKER_USERNAME/$IMAGE_NAME:latest
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest
