// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthAndWei {
    uint256 public oneWei = 1 wei;
    uint256 public oneGWei = 1 gwei;
    uint256 public oneEth = 1 ether;
    
    bool public flag1 = (1 wei == 1);
    bool public flag2 = (1 gwei == 1e9);                // 1 * 10^9
    bool public flag3 = (1 ether == 1 * 10**18);        // 1 * 10^18
}