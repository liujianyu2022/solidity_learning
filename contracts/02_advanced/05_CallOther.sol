// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

event Log(address sender, uint256 value);

interface IOther {
    function getBalance() external returns(uint256);
    function setX(uint256) external payable;
    function getX() external view returns(uint256);
}

contract Other is IOther {
    uint256 private x = 0;

    function setX(uint256 _x) external payable {
        x = _x;

        if(msg.value > 0){
            emit Log(msg.sender, msg.value);
        } 
    }

    function getX() external view returns(uint256) {
        return x;
    }

    function getBalance() external view returns(uint256) {
        return address(this).balance;
    } 
}

contract CallOther {
    // 先将 地址类型转为 Other 类型
    // 目标合约的函数是payable的，那么我们可以通过调用它来给合约转账
    function callSetX1(address _other, uint256 _x, uint256 _value) public payable {
        Other(_other).setX{value: _value}(_x);
    }

    // 直接使用 Other 类型形参
    function callSetX2(Other _other, uint256 _x, uint256 _value) public payable { 
        _other.setX{value: _value}(_x);
    }

    // 使用接口 IOther 类型
    function callSetX3(IOther _other, uint256 _x, uint256 _value) public payable { 
        _other.setX{value: _value}(_x);
    }

    function callGetX(IOther _other) public view returns(uint256) {
        return _other.getX();
    }

    function getBalance() external view returns(uint256) {
        return address(this).balance;
    }

    receive() external payable { }

    fallback() external payable { }
}

// npx hardhat compile