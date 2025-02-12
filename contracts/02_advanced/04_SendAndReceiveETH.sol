// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

event ReceiveLog(address sender, uint256 value);
event ReceiptLog(address sender, uint256 value, bytes data);

error CallFailed(bytes data);
error SendFailed();

// transfer 和 send 都是向目标地址发送一定数量的以太币。都限制了 Gas 传递的数量（固定为 2300 Gas），用于防止复杂的回调函数执行。  
// transfer()如果转账失败，会自动revert（回滚交易）  
// send()如果转账失败，不会revert。send()的返回值是bool，代表着转账成功或失败，需要额外代码处理一下。  
// 在开发中推荐使用 call，因为它没有固定的 gas 限制，灵活且安全性更高。 

contract SendETH {
    // 构造函数，payable使得部署的时候可以转eth进去
    constructor() payable {}

    // 在开发中推荐使用 call，因为它没有固定的 gas 限制，灵活且安全性更高。 
    function call1(address _to, uint256 _amount) public {
        (bool success, bytes memory data) = _to.call{value: _amount}("");
        if(!success) revert CallFailed(data);
    }

    function call2(address _to, uint256 _amount, string memory _data) public {
        bytes memory callData = abi.encodeWithSignature(
            "receipt(string)",
            _data
        );

        (bool success, bytes memory data) = _to.call{value: _amount}(callData);

        if(!success) revert CallFailed(data);
    }

    // send()如果转账失败，不会revert。send()的返回值是bool，代表着转账成功或失败，需要额外代码处理一下。
    function send(address payable _to, uint256 _amount) public {
        bool success = _to.send(_amount);
        if(!success) revert SendFailed();
    }

    // transfer() 如果转账失败，会自动revert（回滚交易）
    function transfer(address payable _to, uint256 _amount) public {
        _to.transfer(_amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract ReceiveETH {
    
    function receipt(string memory _str) public payable {
        bytes memory data = abi.encode(_str);
        emit ReceiptLog(msg.sender, msg.value, data);
    }

    receive() external payable {
        emit ReceiveLog(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
