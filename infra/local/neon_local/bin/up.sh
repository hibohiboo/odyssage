#!/bin/bash

bin_dir=$(cd $(dirname $0) && pwd)
docker_dir=$(cd $bin_dir/.. && pwd)

# up.sh docker-compose.camp.yml
composeFile=${1:-"docker-compose.yml"}

# tblsのためにdbdocフォルダを削除
rm -rf $docker_dir/dbdoc

# docker-composeの起動
cd $docker_dir && docker-compose --profile dev --env-file .env -f $composeFile up
