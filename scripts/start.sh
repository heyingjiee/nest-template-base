#!/usr/bin/env bash

# 确保脚本抛出遇到的错误
set -e

echo "===== Start ($NODE_ENV)====="

pnpm build
cd ./dist
pm2 start ecosystem.config.cjs --env "$NODE_ENV"

echo "===== Start Success====="

exit 0
