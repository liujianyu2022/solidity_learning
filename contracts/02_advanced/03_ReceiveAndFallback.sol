// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReceiveAndFallback {
    event Receive(address sender, uint256 value);
    event Fallback(address sender, uint256 value, bytes data);

    // 在msg.data为空，并且有 receive() 的时候被触发
    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value, msg.data);
    }
}