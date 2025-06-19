// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// openzeppelin：     https://www.openzeppelin.com/solidity-contracts
// metadata standard：https://docs.opensea.io/docs/metadata-standards
// opensea testnets:  https://testnets.opensea.io/

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    // string constant METADATA = "https://ipfs.filebase.io/ipfs/QmWcHe7ZcfS8VDrbpYqGmbdaBRdLG59ypXtG1dcNWDWvu6";
    string constant METADATA = "ipfs://QmWcHe7ZcfS8VDrbpYqGmbdaBRdLG59ypXtG1dcNWDWvu6";             // 简写
    
    constructor(string memory _nftName, string memory _nftSymbol, address _owner) ERC721(_nftName, _nftSymbol) Ownable(_owner){

    }

    function safeMint(address to) public onlyOwner returns (uint256){
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, METADATA);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address){
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)internal override(ERC721, ERC721Enumerable){
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool){
        return super.supportsInterface(interfaceId);
    }
}

