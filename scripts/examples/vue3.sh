#!/usr/bin/env sh

set -e

# 进入生成的文件夹
cd examples-copy/vue3

git init
git add -A
git commit -m 'deploy'

git push -f git@gitee.com:ye_chao111/virtual-monitor-vue3-example.git master

cd -