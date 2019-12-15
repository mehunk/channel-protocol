# 通道协议

## 开发

### 本地开发

首先在本地安装依赖包。

```shell script
$ yarn # 或者是 npm i
$ lerna bootstrap
```

### 使用本地依赖包进行开发

为了使用本地也正在开发的运营商基础 SDK 库，需要按照以下方式执行。

```shell script
$ lerna add --no-bootstrap /Users/weiqiang/Documents/Dev/Personal/Libraries/china-carrier-iot-sdk/packages/cucc --scope=@channel-protocol/cucc
$ lerna link convert
$ lerna bootstrap
```

### 打包

首先在本地安装依赖包。

```shell script
$ yarn # 或者是 npm i
$ lerna bootstrap
```

在根目录下执行。

```shell script
$ sh build.sh
```
