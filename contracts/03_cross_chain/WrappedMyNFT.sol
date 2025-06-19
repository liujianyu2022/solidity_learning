// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { MyNFT } from "../01_basic/05_MyNFT.sol";

contract WrappedMyNFT is MyNFT {
    constructor(string memory _nftName, string memory _nftSymbol, address _owner) MyNFT(_nftName, _nftSymbol, _owner) {

    }

    // MyNFT中的safeMint函数中的tokenId只能是自增1的
    // 为了使得和源联中的tokenId对应的上，因此这里的tokenId必须自行指定
    function mintTokenWithSpecificTokenId(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}

