1. transfer 和 send 之间有什么区别？为什么不应该使用它们？  
   transfer 和 send 都是向目标地址发送一定数量的以太币。都限制了 Gas 传递的数量（固定为 2300 Gas），用于防止复杂的回调函数执行。  
   transfer()如果转账失败，会自动revert（回滚交易）  
   send()如果转账失败，不会revert。send()的返回值是bool，代表着转账成功或失败，需要额外代码处理一下。  
   在开发中推荐使用 call，因为它没有固定的 gas 限制，灵活且安全性更高。 

   ```javascript
   // eth的发送方就是这个合约自身
   function call(address payable _to, uint amount) public payable{
      (bool flag, bytes memory data) = _to.call{value: amount, gas: 2300}("");
      if(!flag) revert callFailed();               // 由于call报错后不会自动revert，需要手动抛出错误      
   }
    
   // eth的发送方就是这个合约自身
   function transfer(address payable _to, uint amount) public payable{
      _to.transfer(amount);                        // 由于transfer报错后会自动revert，不需要手动抛出错误
   }
    
   // eth的发送方就是这个合约自身
   function send(address payable _to, uint amount) public payable{
      bool res = _to.send(amount);
      if(!res) revert sendFailed();                // 由于send报错后不会自动revert，需要手动抛出错误
   }
   ```
2. 如何在 Solidity 中编写高效的 gas 循环？  
   在 Solidity 中编写高效的循环是优化合约 gas 消耗的关键。  

3. 代理合约中的存储冲突是什么？  
   在 Solidity 中，代理合约中的存储冲突（Storage Collision）是指代理合约（Proxy）和实现合约（Implementation Contract）之间的存储布局发生冲突，导致数据被错误地读写。因为代理合约通过 delegatecall 执行逻辑，而 delegatecall 使用调用者（即代理合约）的存储布局。  
   
