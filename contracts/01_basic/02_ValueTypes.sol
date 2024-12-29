// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ValueTypes {
    bool public flag = true;

    int256 public num1 = 10;
    int256 public num2 = type(int256).max;

    address public addr1 = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address public addr2 = payable(addr1);
    uint256 public balance = addr2.balance;

    bytes public arr = "hello";
}