// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Hello {
    string public str = "hello";

    function getStr() public view returns (string memory) {
        return str;
    }
}