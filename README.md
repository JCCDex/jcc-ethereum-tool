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
  "network" : 101,
  "gasPrice" : 20000000000,
  "gasLimit" : 20000
  "wallet" : {"address": "0x1234", "secret": "0x1223"}
}
```

**_注意：不能确认在安全情况下，不要在配置文件中使用明文保存密钥，尽量使用 keystore 文件_**

用户可以指定配置文件路径

```javascript
jcc-ethereum-tool --config myconfig.json
```

## normal operation 常规操作

- 创建钱包

```javascript
jcc-ethereum-tool --wallet_create
```

- 创建钱包并保存为 keystore 文件

```javascript
jcc-ethereum-tool --wallet_create --save_wallet
```

- 导入私钥存为 keystore 文件

```javascript
jcc-ethereum-tool --import_private_to_keystore
```

- 获取余额

```javascript
jcc-ethereum-tool --network 99 --balance 0x1111 --server http://localhost:8545
```

- 转账

```javascript
# 从配置 (config.json) 的钱包向目的地址转账
jcc-ethereum-tool --transfer 0x2222 --amount 0.000001 --network 101
```

- 查询区块

```javascript
jcc-ethereum-tool --block latest
或者
jcc-ethereum-tool --block 1234
```

- 查询交易

```javascript
jcc-ethereum-tool --transaction 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
```

- 查询交易收据

```javascript
jcc-ethereum-tool --receipt 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
```

- 发行合约

```javascript
jcc-ethereum-tool --deploy "./MAYAToken.json" --gas_limit 3800000 --parameters '"parameter1","parameter2"'

// 合约大小会影响gas limit,所以请自己设置合适的gas limit
// 其次是创建合约可能是有参数的，请按照参数顺序在--parameters中设置
```

- 任意合约的方法调用

jcc-ethereum-tool 支持任意合约的调用，一般来说需要以下几个参数

- 指定 abi 文件，便于解析各种调用签名和参数，可以指定成自己的 abi 文件
- 对于修改账本的调用，gas 数量需要自己指定，默认是 20000，gasPrice 默认 20G
- 数量尤其是小数位的推算，可以自己使用 chain3 的函数运算
- 为支持 ens，增加了 namehash 函数支持

## ERC20 的操作

- 获取基本信息

```javascript
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "name"
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "symbol"
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "decimals"
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "totalSupply"
```

- 获取钱包余额

```javascript
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "balanceOf" --parameters '"0xaddress......"'
// 请注意 地址参数分别用单双引号，是为了传递正确的地址
```

- ERC20 的转账

```javascript
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "transfer" --parameters '"0xaddress.....",web3.utils.toWei("23.1")'
// web3.utils.toWei("23.1") 这个可以利用函数转义方式将ERC20的数量展开，但是ERC20也有不是标准的18位小数的，如果需要自行处理小数位，要书写成下面的样子
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "transfer" --parameters '"0xaddress.....",BigNumber(23.1*10**18)'
```

- ERC20 的授权转账

```javascript
// 授权0x5d819874014dfc29ec6d56caacc4e95f2dd33352从指定账户转账额度
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --keystore keystorefile.json --password yourkeystorepassword --gas_limit 50000 --method "approve" --parameters '"0xspender address", web3.utils.toWei("333")'

// 查询授权数量
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --method "allowance" --parameters '"0xowner address","0xspender address"'

// 授权转账
jcc-ethereum-tool --abi erc20abi.json --contractAddr "0x2bbe1b5b974aa75369ec72200c9c7da717faa627" --keystore keystorefile.json --password yourkeystorepassword --gas_limit 50000 --gas_price 1000000000 --method "transferFrom" --parameters '"0xowner address","0xdestination address", web3.utils.toWei("300")'
```
