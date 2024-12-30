// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract ToString {
    using Strings for address;
    using Strings for uint256;

    // uint256 可以直接转为 string
    function uint256ToString(uint256 value) public pure returns (string memory) {
        return value.toString();
    }

    // 其他int类型需要先转为 uint256，然后再转为 string
    function int256ToString(int256 value) public pure returns (string memory) {
        if (value < 0) {
            return string(abi.encodePacked("-", uint256(-value).toString()));
        }
        return uint256(value).toString();
    }

    // 其他int类型需要先转为 uint256，然后再转为 string
    function uint8ToString(uint8 value) public pure returns (string memory) {
        return uint256(value).toString();
    }

    // 其他int类型需要先转为 uint256，然后再转为 string
    function int8ToString(int8 value) public pure returns (string memory) {
        if (value < 0) {
            return
                string(
                    abi.encodePacked("-", uint256(uint8(-value)).toString())
                );
        }

        return uint256(uint8(value)).toString();
    }

    function addressToString(address value) public pure returns (string memory) {
        // return Strings.toHexString(value);
        return value.toHexString();
    }

    function boolToString(bool value) public pure returns (string memory) {
        return value ? "true" : "false";
    }
}
