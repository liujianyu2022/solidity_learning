// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Function {
    int256 public num;

    constructor(int256 _num) {
        num = _num;
    }

    function add() external {
        num += 1;
    }

    function getNum() view public returns(int256) {
        return num;
    }

    // pure 既不能读取也不能修改状态变量
    function addPure(int256 _num) public pure returns (int256) {
        return _num + 1;
    }

    // view 能读取，但是不能修改状态变量
    function addView(int _num) public view returns (int256 res) {
        res = _num + num;
    }

    function getBalance() external view returns (uint256 balance) {
        balance = address(this).balance;
    }
}
