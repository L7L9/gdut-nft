// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../lib/contracts/token/ERC721/ERC721.sol";

contract Factory is ERC721{
    //铸造事件
    event Mint(address indexed owner,uint256 tokenId,string name,string cid,bool status);

    //nft属性
    struct nftProperty{
        //id
        uint256 id;
        //代币唯一标志
        uint256 tokenId;
        //ipfs中的cid
        string cid;
        //nft名字
        string name;
        //作者
        address author;
    }

    //nft集合
    mapping(uint256 => nftProperty) nfts;

    //nft的总数量
    uint256 nftAmount;

    constructor() ERC721("nft","NFT"){}

    //铸造
    function mint(uint256 _tokenId,string memory _name,string memory _cid) external{
        _mint(msg.sender, _tokenId);
        nftProperty memory nft = nftProperty({
            id: nftAmount,
            tokenId: _tokenId,
            cid: _cid,
            name: _name,
            author: msg.sender
        });
        nfts[nftAmount] = nft;

        nftAmount++;

        emit Mint(msg.sender,_tokenId,_name,_cid,true);
    }

    //获取单个nft的信息
    function getProperty(uint256 tokenId) external view returns(uint256,string memory,string memory,string memory,bool){
        
    }
}