1. transfer 和 send 之间有什么区别？为什么不应该使用它们？  
   transfer 和 send 都是向目标地址发送一定数量的以太币。都限制了 Gas 传递的数量（固定为 2300 Gas），用于防止复杂的回调函数执行。  
   transfer()如果转账失败，会自动revert（回滚交易）  
   send()如果转账失败，不会revert。send()的返回值是bool，代表着转账成功或失败，需要额外代码处理一下。  

