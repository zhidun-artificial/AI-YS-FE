#!/bin/bash

# Define the name as a variable
DIRNAME="aihub"

# 将dist文件更名为knowledge
if [ -d "dist" ]; then
  mv dist "$DIRNAME"
fi

# 创建dist文件夹
mkdir -p dist

# 将knowledge移动到dist文件夹中
if [ -d "$DIRNAME" ]; then
  mv "$DIRNAME" dist/
fi

# 将knowledge文件压缩为knowledge.zip
cd dist
zip -r "$DIRNAME.zip" "$DIRNAME"
cd ..

# 打开dist文件夹
open dist
