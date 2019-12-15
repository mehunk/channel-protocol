#!/bin/sh

# 一键打包命令

base_dir=$(pwd)

# 在根目录下创建 dist 目录

if test -d dist
then
  rm -rf dist
fi

mkdir dist

# 遍历 packages 下的目录

cd packages

for dir in *
do
  if test -d $dir # 如果是目录
  then
    # 在 dist 目录下建立名字相同的目录
    mkdir $base_dir/dist/$dir
    # 进入到目录中
    cd $base_dir/packages/$dir
    # 运行打包命令
    npm run build
    # 将 package.json 和 lib 目录拷贝到 dist/名字相同的目录 下
    cp $base_dir/packages/$dir/package.json $base_dir/dist/$dir/
    cp -R $base_dir/packages/$dir/lib $base_dir/dist/$dir/
    cd $base_dir/packages
  fi
done
