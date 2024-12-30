// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Overload {
    using Strings for uint256;

    function fn1(uint256 _a, bool _b) public pure returns(string memory) {
        string memory str1 = _a.toString();
        string memory str2 = _b ? " true" : " false";

        // 注意：Solidity 不支持直接用 + 操作符拼接字符串
        // return str1 + str2 ;       

        return string(abi.encodePacked(str1, str2));
    }
    
    function fn1(bool _a, uint256 _b) public pure returns(string memory) {
        string memory str1 = _a ? "true " : "false ";
        string memory str2 = _b.toString();

        return string(abi.encodePacked(str1, str2));
    }
}