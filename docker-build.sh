#!/usr/bin/env bash
set -e

git_commit=`git rev-parse --short HEAD`
build_date=`date -u +"%Y-%m-%dT%H:%MZ"`
version=$(jq '.version' package.json | tr -d '"')

tag=$1

rm build/src/configurations/env/environment.json ||

if [ $DOCKER_HOST ]; then echo "DOCKER_HOST $DOCKER_HOST"; fi

docker build --build-arg git_commit=$git_commit \
                  --build-arg build_date=$build_date \
                  --build-arg version=$version \
                  -t illuque/todo_app$tag .
