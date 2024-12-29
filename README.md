# hardhat 常用命令
1. npm init -y        
2. npm install --save-dev hardhat         指定版本 @2.22.2
3. npx hardhat init                       创建项目模板
3.1 npm install --save-dev "@nomicfoundation/hardhat-toolbox@^5.0.0"          会自动安装这个的，如果没有就运行这个
4. npx hardhat help                       查看子命令
5. npx hardhat compile                    编译    读取 hardhat.config.js 中的配置，编译所有的智能合约，并生成相应的 ABI 和字节码文件。
6. npx hardhat clean
7. npx hardhat typechain
8. npx hardhat run                        运行指定的 JavaScript 脚本，常用于部署合约等操作。     npx hardhat run ./scripts/deploy.js
9. npx hardhat test                       执行位于 ./test/ 目录下的测试脚本，通常使用 Mocha 框架
10. npx hardhat node                      启动一个本地的测试区块链，方便开发和测试。