#!/bin/bash

# デバッグモードを有効にする
set -x

# localhost ではなく 127.0.0.1 を使用
# 認証エミュレータの健全性チェック
if ! curl -s http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-odyssage > /dev/null; then
  echo "Firebase Auth emulator is not ready"
  exit 1
fi

# UI確認（UIの確認はエミュレータ起動に必須ではないため省略可）
# if ! curl -s http://127.0.0.1:4000 > /dev/null; then
#   echo "Firebase UI is not ready"
#   exit 1
# fi

echo "Firebase emulators are ready"
exit 0