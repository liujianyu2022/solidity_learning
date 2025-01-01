1. 私有、内部、外部和公共函数之间的区别？  
   私有（private）：只能在定义它的合约内部调用。  
   内部（internal）：可以在定义它的合约内部，以及子合约中调用。  
   外部（external）：只能从合约外部调用，自身合约和子合约都无法直接调用。相比公共函数，更节省gas。  
   公共（public）：可以在任何地方调用，包括合约内部和外部。  

2. view 和 pure 函数有什么区别？  
   view 函数表明它不会修改合约的状态，但可以读取合约的状态。比如会读取状态变量或者全局变量。  
   pure 函数表明它既不修改合约状态，也不读取合约状态，它不会读取状态变量或者全局变量。

3. 1 Ether 相当于多少个 wei，多少个 gwei？  
   1 Ether = 10 ^ 9 gwei  
   1 Ether = 10 ^ 18 wei

4. Solidity 0.8.0 版本对算术运算的有什么重大变化？  
   Solidity 0.8.0 引入了默认的算术溢出和下溢检查，当发生溢出或者下溢的时候，交易会被revert。  
   在之前的版本中，溢出和下溢不做检查，需要借助类似于SafeMath这样的第三方库进行检查。  
   补充：溢出（Overflow）：结果超出最大值； 下溢（Underflow）：结果小于最小值。

5. 对于智能合约中，实现允许地址列表 allowList，使用映射还是数组更好？为什么？  
   使用映射 mapping 更好，因为它的查找效率更高，可以快速检查一个地址是否在 allowList 中。  
   mapping 的查找时间是固定常数级的，时间复杂度为 O(1)。  
   数组在遍历整个列表时，查找时间与数组长度有关，时间复杂度为 O(n)。  
   补充：  
   mapping 的查找时间复杂度为 O(1) 是因为 Solidity 使用了 哈希表的数据结构来实现 mapping

6. 以太坊主要使用什么哈希函数？  
   以太坊使用的哈希函数是 Keccak-256，这是 SHA-3 的前身。  
   以太坊中许多关键操作，如计算地址、交易哈希等，都使用 Keccak-256。
   以太坊的开发时，SHA-3 标准还没有正式确定。

7. assert 和 require有什么区别？  
   require：用于验证输入和条件，如果条件不满足，操作会 revert，并退回未使用的 gas。  
   assert：用于检查代码不应出现的严重的内部错误，比如除以0运算。如果 assert 失败，会消耗所有提供的 gas。  
   require 使用较多，而 assert 很少使用。

8. 为什么 Solidity 不支持浮点数运算？  
   在 Solidity 中，原生数据类型 不支持小数或浮点数。所有的计算都基于整数，这是为了确保精确性和避免与浮点运算相关的舍入误差。  
   在区块链环境中，浮点数运算可能导致不一致的结果，因为不同环境下的计算方式和精度存在差异。

9. Solidity 中整数除法是不是遵循四舍五入？  
   在Solidity中，除法运算并不会执行四舍五入，而是直接舍去小数部分，只保留整数结果。  
   这种行为通常被称为“向下取整”或“截断”。

10. 智能合约大小最大多少？  
   智能合约编译后的二进制代码，不能超过24KB，这是EIP-170规定的限制。  
   超过大小限制的合约需要分割成多个合约。这是以太坊虚拟机的限制。

11. Solidity 提供哪些关键字来测量时间？  
   block.timestamp: 返回当前块的时间戳。  
   seconds, minutes, hours, days, weeks 主要用来将数字转换为对应的时间长度（以秒为单位）  
   比如：  
   uint256 public oneSecond = 1 seconds;    // 等价于 1  
   uint256 public oneMinute = 1 minutes;    // 等价于 60  
   uint256 public oneHour = 1 hours;        // 等价于 3600  
   uint256 public oneDay = 1 days;          // 等价于 86400  
   uint256 public oneWeek = 1 weeks;        // 等价于 604800

12. 在 Solidity 中，uint256 和 int256 的取值范围是多少，如何获取？  
  uint256 取值范围 为 [0, 2^256 - 1] = [type(uint256).min, type(uint256).max]  
  int256 取值范围 为 [-2^255, 2^255 - 1] = [type(int256).min, type(int256).max]

13. fallback 和 receive 之间有什么区别？  
  receive 函数：当外部向合约转入以太币时触发，它是一个无参数的 payable 函数。  
  fallback 函数：当外部调用不存在的函数或转入以太币时触发。当然在转入以太币时触发的前提条件是：不存在 receive 函数，而且使用 payable 修饰。  
  区别：receive 专门用于接收以太，而 fallback 更通用，用于处理所有未匹配的函数调用和以太接收。

14. solidity 中的修饰符 modifier 有什么作用？  
  Solidity 中的修饰符是可重用的代码片段，用于在函数执行前后执行预定义的逻辑，比如权限检查或状态验证。  
  修饰符可以附加到函数上，在不重复编写相同代码的情况下，为函数添加特定逻辑，减少了代码冗余。  

15. 有哪些方式可以向智能合约中存入以太币？  
  有三种方式可以向智能合约中存入以太币：  
  第一种，通过带有 paybale 修饰的构造函数，在部署合约时存入以太币。  
  第二种，定义带有 paybale 的普通函数，在外部调用函数时，同时存入以太币。  
  第三种，智能合约中定义了 receive 或者 fallback 函数，外部可以通过钱包或者转账函数直接存入合约。

16. Solidity 访问控制有哪些，有什么用？  


17. 以太坊什么机制阻止了无限循环的永远运行？  
  阻止运行无限循环的机制是 Gas 限制。每个以太坊上的交易都需要消耗 Gas  
  如果交易执行过程中超过了发送者为该交易提供的 Gas 限制，执行将停止，交易会被 revert。  
  另外，以太坊区块也有一个最大 Gas 限额，所以每个区块也只能包含有限量的计算。超过这个限额，交易就会被终止。
  补充：  
  以太坊区块的最大 Gas 限额 是动态的，会随着网络的需求而变化  
  每个区块的最大 Gas 限额是由前一个区块的 Gas 限额决定的，调整幅度最多为前一个区块限额的 +/- 12.5%。
  ```javascript
  const { ethers } = require("ethers");
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

  async function getGasLimit() {
      const block = await provider.getBlock("latest");
      console.log("Current Block Gas Limit:", block.gasLimit.toString());
  }
  ```
18. 在一个智能合约中调用另一个智能合约时可以转发多少 gas？  
  当一个智能合约调用另一个智能合约的函数时，可以附带一个可选的 gas 参数，用于指定发送交易时转发的 gas 数量。  
  如果没有指定 gas 数量，Solidity 默认会将当前交易剩余的 gas 全部转发给被调用的合约。 

  信任问题： 在调用外部合约时，建议限制 Gas 传递，以防止恶意合约滥用 Gas 消耗。  
  重入攻击： 显式限制 Gas 可以减少重入攻击的风险，但不能完全防止。建议结合其他安全措施（例如使用 checks-effects-interactions 模式）。  
  Gas 的合理估算： 对于调用的外部合约，最好对其 Gas 消耗有一定的预估，从而避免因 Gas 不足导致的调用失败。  
  ```javascript
   contract A {
      function callBWithGas(address bAddress) public {
         B(bAddress).someFunction{gas: 50000}();             // 显式指定转发的 Gas 数量
      }

      function callB(address bAddress) public {
         B(bAddress).someFunction();                         // 默认将剩余 Gas 转发给 B
      }
   }
  ```

19. ERC20 合约中的 transfer 和 transferFrom 有什么区别？  
  transfer：将代币从调用者（msg.sender）的余额中直接转账到指定的 to 地址。用于用户直接转账代币  
  transferFrom：将代币从 from 的余额中转账到 recipient 地址，但前提是第三方调用者已被授权，用于第三方操作代币，例如 DEX 使用用户的代币进行交易  
  ```javascript
   function transfer(address to, uint256 amount) public returns (bool);
   function transferFrom(address from, address recipient, uint256 amount) public returns (bool);
  ```

20. 在区块链上如何使用随机数？  
  由于区块链要求确定性，所有节点的数据必须达成一致，而且是公开的。所以，在智能合约中生成的随机数，任何人都是可以预测的，无法实现真正的随机性。  
  通常需要外部预言机提供真正的随机数，比如chainlink，或者通过未来某个区块上的数据来实现。  