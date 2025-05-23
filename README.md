# jcc-ethereum-tool

![npm](https://img.shields.io/npm/v/jcc-ethereum-tool.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-ethereum-tool.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-ethereum-tool)
[![npm downloads](https://img.shields.io/npm/dm/jcc-ethereum-tool.svg)](http://npm-stat.com/charts.html?package=jcc-ethereum-tool)

jcc-ethereum-tool is a command tool, which is can be use to transfer, query balance, manipute ERC20, ERC721 by parameters or config file.

jcc-ethereum-tool 是一个命令行工具，可以快速的通过参数或者配置文件形式操作 ETH 链，实现转账，查询余额，ERC20，ERC721 等通证操作。

## Installation 安装

```bash
sudo npm install -g jcc-ethereum-tool --unsafe-perm=true
```

## wallet and configuration 钱包和配置

在用户的目录下存在.jcc-ethereum-tool/config.json 文件，类似配置

```javascript
{
  "server" : "http://localhost:8546",
  "gasPrice" : 20000000000,
  "gasLimit" : 20000,
  "wallet" : {"address": "0x1234", "secret": "0x1223"}
}
```

**_注意：不能确认在安全情况下，不要在配置文件中使用明文保存密钥，尽量使用 keystore 文件_**

用户可以在进行具体操作时（如 transfer, balance)指定配置文件路径

```javascript
jcc-ethereum-tool --config myconfig.json
// or
jcc-ethereum-tool --config myconfig.json balance 0x1111
```

## normal operation 常规操作

- 创建钱包

```javascript
jcc-ethereum-tool wallet_create
```

- 创建钱包并保存为 keystore 文件

```javascript
jcc-ethereum-tool wallet_create --save_wallet
```

- 导入私钥存为 keystore 文件

```javascript
jcc-ethereum-tool import_private_to_keystore
```

- 获取余额

```javascript
jcc-ethereum-tool balance 0x1111 --server http://localhost:8545
```

- 转账

```javascript
# 从配置 (config.json) 的钱包向目的地址转账
jcc-ethereum-tool transfer 0x2222 0.000001
```

- 查询区块

```javascript
jcc-ethereum-tool block latest
或者
jcc-ethereum-tool block 1234
```

- 查询交易

```javascript
jcc-ethereum-tool transaction 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
```

- 跟踪交易

```javascript
jcc-ethereum-tool traceTransaction 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
// 跟踪交易，会输出所有的内部调用，包括合约调用。请选择支持debug_traceTransaction的节点
```

- 查询交易收据

```javascript
jcc-ethereum-tool receipt 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
```

- 发行合约

```javascript
// deploy <contract json file> [args...]
jcc-ethereum-tool --gas_limit 3800000 deploy "./MAYAToken.json" arg1 arg2

// 合约大小会影响gas limit,所以请自己设置合适的gas limit
// 其次是创建合约可能是有参数的，请按照参数顺序在命令后依次添加中设置

// 使用create2发行合约
// deploy2 <abi file> <contract address> <method name> [args...]
jcc-ethereum-tool --gas_limit 3800000 deploy2 "./FactoryContract.json" FactoryAddress deployMethod arg1 arg2
// 使用create2发行合约，通过工厂合约进行发布，于合约调用类似，需要提供abi、调用的method名以及可能需要的parameters
```

- 生成 create2 合约地址

```javascript
// generateCreate2Address <contract json file> <sender address> <salt> [args...]
jcc-ethereum-tool generateCreate2Address "./contract.json" address "salt" arg1 arg2
// salt 控制合约地址的生成。通过不同的salt，同一个合约的字节码(initcode)可以多次部署到不同的地址
// 在部署合约时，可能需要一些参数生成initcode，请按照constructor的参数顺序在命令后依次添加中设置
```

- 编码 calldata: 用于与合约交互

```javascript
// encodeCallData <abi file> <method name> [args...]
jcc-ethereum-tool encodeCallData "./contract.json" FactoryAddress "method" arg1 arg2
// 如果method是constructor，说明合约并没有发布，所以生成的是initcode，此时contractAddr并不重要
```

- 任意合约的方法调用

jcc-ethereum-tool 支持任意合约的调用，一般来说需要以下几个参数

- 指定 abi 文件，便于解析各种调用签名和参数，可以指定成自己的 abi 文件
- 对于调用 abi 的参数（arg），如果是对象、数组或者语句必须用双引号引起来。
- 对于修改账本的调用，gas 数量需要自己指定，默认是 20000，gasPrice 默认 20G
- 数量尤其是小数位的推算，可以自己使用 chain3 的函数运算
- 为支持 ens，增加了 namehash 函数支持

## ERC20 的操作

```javascript
abi <abi file> <contract address> <method name> [args...]
```

- 获取基本信息

```javascript
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "name"
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "symbol"
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "decimals"
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "totalSupply"
```

- 获取钱包余额

```javascript
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "balanceOf" "0xaddress......"
```

- ERC20 的转账

```javascript
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "transfer" "0xaddress....." "web3.utils.toWei(23.1, 'ether')"
// web3.utils.toWei("23.1") 这个可以利用函数转义方式将ERC20的数量展开，但是ERC20也有不是标准的18位小数的，如果需要自行处理小数位，要书写成下面的样子
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "transfer" "0xaddress....." "BigNumber(23.1*10**18)"
```

- ERC20 的授权转账

```javascript
// 授权0x5d819874014dfc29ec6d56caacc4e95f2dd33352从指定账户转账额度
jcc-ethereum-tool --keystore keystorefile.json --password yourkeystorepassword --gas_limit 50000 abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "approve" "0xspender address" "web3.utils.toWei(333, 'ether')"

// 查询授权数量
jcc-ethereum-tool abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "allowance" "0xowner address" "0xspender address"

// 授权转账
jcc-ethereum-tool --keystore keystorefile.json --password yourkeystorepassword --gas_limit 50000 --gas_price 1000000000 abi erc20abi.json "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" "transferFrom" "0xowner address" "0xdestination address" "web3.utils.toWei(300, 'ether')"
```

- 从编译好的合约文件中提取 abi、bytecode

```javascript
jcc-ethereum-tool getAbiOfFile contractFilePath // 获取合约文件中的abi，并提取存放在abi.json
jcc-ethereum-tool getBytecodeOfFile contractFilePath //获取合约文件中的bytecode，并提取存放在bytecode.json

// 请确保编译好的合约文件存在abi、bytecode字段
```

注: 使用文件时，请确保格式为:

```javascript
{
    bytecode: "hex string" or {object: "hex string" ...},
    abi: [...]
}
```
