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
