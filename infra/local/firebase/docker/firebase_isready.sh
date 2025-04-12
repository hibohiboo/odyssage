#!/bin/bash

# 認証エミュレータの健全性チェック
if ! curl -s http://localhost:9099/identitytoolkit.googleapis.com/v1/projects/demo-odyssage > /dev/null; then
  echo "Firebase Auth emulator is not ready"
  exit 1
fi

# UI確認（オプション）
if ! curl -s http://localhost:4000 > /dev/null; then
  echo "Firebase UI is not ready"
  exit 1
fi

echo "Firebase emulators are ready"
exit 0