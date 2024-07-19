#!/usr/bin/env bash

# 确保脚本抛出遇到的错误
set -e

echo "===== Build Start====="
nest build
cp -r package.json ./dist && echo "copy package.json"
cp -r Dockerfile ./dist && echo "copy Dockerfile"
cp -r ecosystem.config.cjs ./dist && echo "copy ecosystem.config.cjs"
echo "===== Build Success====="
exit 0
