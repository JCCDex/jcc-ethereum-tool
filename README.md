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
//balance <address> --server <ETH node url>
jcc-ethereum-tool balance 0x1111 --server http://localhost:8545
```

- 转账

```javascript
//transfer <Destination address> <amount>
# 从配置 (config.json) 的钱包向目的地址转账
jcc-ethereum-tool transfer 0x2222 0.000001
```

- 查询区块

```javascript
//block <block>
jcc-ethereum-tool block latest
或者
jcc-ethereum-tool block 1234
```

- 查询交易

```javascript
//transaction <txHash>
jcc-ethereum-tool transaction 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
```

- 跟踪交易

```javascript
//traceTransaction <txHash>
jcc-ethereum-tool traceTransaction 0xbb15e089f12c9d4fcd82e47c3d3b56940c9ad6e51a9c7b5dfec4337f5fb4f58e
// 跟踪交易，会输出所有的内部调用，包括合约调用。请选择支持debug_traceTransaction的节点
```

- 查询交易收据

```javascript
//receipt <txHash>
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
//getAbiOfFile <contractFile file>
//getBytecodeOfFile <contractFile file>

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

## safe 的操作

- 创建生成 safe account (safe proxy 合约地址)

```javascript
// generateSafe <threshold number> <saltNonce> <owners...>
jcc-ethereum-tool generateSafe threshold saltNonce owner1 owner2

// generateKnownSafe <safeAddress address> <chainId number>
// 需要在当前链上部署(生成) chainId 链上 safe address
jcc-ethereum-tool generateKnownSafe safeAddress chainId
```

- 生成并签署转账的安全交易

生成好的 safe transaction, 存储在本地当前目录下。内容包含收集的签名和交易内容。

```javascript
// safeTransfer <safeAddress address> <Destination address> <amount>
jcc-ethereum-tool safeTransfer safeAddress destination amount
```

- 生成并签署合约交互的安全交易

```javascript
// safeContractTx <safeAddress address> <abi file> <contract address> <method name> [args...]
jcc-ethereum-tool safeContractTx safeAddress abi contract method arg1 arg2
```

- 签署本地的安全交易文件

```javascript
// safeConfirm <safeAddress address> <safeTxFile file>
jcc-ethereum-tool safeConfirm safeAddress safeTxFile
```

- 执行已经收集签名完成的安全交易文件

```javascript
// executeSafeTx <safeAddress address> <safeTxFile file>
jcc-ethereum-tool executeSafeTx safeAddress safeTxFile
```

- 为 safe account 添加守卫(guard)功能

```javascript
// 提供guard功能，为safe account提供交易保护机制; 需要自己提供安全可靠的符合safe guard要求的guard合约。
// enableSafeGuardTx <safeAddress address> <guardAddress address>
jcc-ethereum-tool enableSafeGuardTx safeAddress guardAddress
```

- 为 safe account 关闭(移除)守卫(guard)功能

```javascript
// disableSafeGuardTx <safeAddress address> <guardAddress address>
jcc-ethereum-tool disableSafeGuardTx safeAddress guardAddress
```

- 得到 safe account 设置的 guard address

```javascript
// getSafeGuard <safeAddress address>
// 返回safe guard contract adress
// 如果返回是0x0000000000000000... 说明没有设置 safe guard
jcc-ethereum-tool getSafeGuard safeAddress
```

- safe 功能使用说明

```javascript
// 当前操作均在polygon链上操作
// 1、如果你没有safe account，则需要先在链上生成部署一个safe account (safe proxy合约)
// threshold: 设置的门槛
// saltNonce: 当threshold与owners都一样时，这个参数确保生成的safe account 有所不同
// owners: 所有者们，可以对提案签名
jcc-ethereum-tool generateSafe threshold saltNonce owner1 owner2

// 2、如果你需要一个提案可以通过safeTransfer和safeContractTx生成一个safeTransaction.json
// safeTransaction.json 提案文件，里面有收集的签名数组和交易内容。
jcc-ethereum-tool safeTransfer safeAddress destination amount ||
jcc-ethereum-tool safeContractTx safeAddress abi contract method arg1 arg2

// 3、获得到了safeTransaction.json可以让其他owner签署交易
jcc-ethereum-tool safeConfirm safeAddress safeTxFile

// 4、safeTransaction.json收集到足够的签名可以通过executeSafeTx执行交易
jcc-ethereum-tool enableSafeGuardTx safeAddress guardAddress

// 5、你可以通过添加 safe gurad 保护你的交易; 当然,这需要收集其他owner同意
jcc-ethereum-tool enableSafeGuardTx safeAddress guardAddress

// 6、你也可以关闭你的 safe gurad, 这也需要收集其他owner同意
jcc-ethereum-tool disableSafeGuardTx safeAddress guardAddress

// 7、获取你设置的 safe gurad 的合约地址
jcc-ethereum-tool getSafeGuard safeAddress

----------------- 添加safe gurad 事例 ------------------
/**
先生成开启(设置)safe guard的提案。
0x7C1fC34898660aF91dC39182fa22A73D953073FC是一个safe account。
0xc0d787711f06bd555db1e1d44b0723277068894a是一个guard contract address;
Safe Guard 可以在 Safe 交易前后进行检查。交易前检查可以在交易执行前以编程方式检查相应交易的所有参数。
交易后检查在交易执行结束时调用，可用于检查 Safe 的最终状态。
所以guard需要自己开发或者寻找的安全可靠的safe guard contract, safe 官方并没有提供相关合约。
0xc0d787711f06bd555db1e1d44b0723277068894a是通过官方提供的示例在polygon部署的guard合约。
https://github.com/gnosisguild/zodiac-guard-scope
实际开发过程中可以基于其开发。
*/
./src/jcc-ethereum-tool enableSafeGuardTx 0x7C1fC34898660aF91dC39182fa22A73D953073FC 0xc0d787711f06bd555db1e1d44b0723277068894a

// 然后需要收集签名执行交易, 这里不做演示。
// 添加了 0xc0d787711f06bd555db1e1d44b0723277068894a，相当于给 0x7C1fC34898660aF91dC39182fa22A73D953073FC 添加了白名单
// 执行提案时, 会根据白名单拒绝执行提案，比如原生币种转账。
./src/jcc-ethereum-tool safeTransfer 0x7C1fC34898660aF91dC39182fa22A73D953073FC 0x646672C0aAC59B26499D971741e94bAd8d20D710 0.1
./src/jcc-ethereum-tool executeSafeTx 0x7C1fC34898660aF91dC39182fa22A73D953073FC ./safeTransaction.json
// 会报Target address is not allowed

// 所以需要允许对方是0x646672C0aAC59B26499D971741e94bAd8d20D710的提案通过
./src/jcc-ethereum-tool abi ./ScopeGuard.json 0xc0d787711f06bd555db1e1d44b0723277068894a setTargetAllowed 0x646672C0aAC59B26499D971741e94bAd8d20D710 true
// ScopeGuard.json这个是0xc0d787711f06bd555db1e1d44b0723277068894a的abi文件
// setTargetAllowed 设置target白名单的函数

// 再执行提案，依旧报错
./src/jcc-ethereum-tool executeSafeTx 0x7C1fC34898660aF91dC39182fa22A73D953073FC ./safeTransaction.json
// 会报Cannot send ETH to this target
// 其实是不允许原生币种转账

// 所以还需要允许向0x646672C0aAC59B26499D971741e94bAd8d20D710进行原生币种转账
./src/jcc-ethereum-tool abi ./ScopeGuard.json 0xc0d787711f06bd555db1e1d44b0723277068894a setValueAllowedOnTarget 0x646672C0aAC59B26499D971741e94bAd8d20D710 true

// 再执行提案，提案执行成功
./src/jcc-ethereum-tool executeSafeTx 0x7C1fC34898660aF91dC39182fa22A73D953073FC ./safeTransaction.json

// 可以通过关闭其safe guard功能，取消这个功能, 再开启这个功能并且地址还是原先地址，则恢复原先配置。
// 这里不做演示
```
