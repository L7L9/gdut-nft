// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../lib/contracts/token/ERC721/ERC721.sol";

contract Factory is ERC721{
    //铸造事件
    event Mint(address indexed owner,uint256 tokenId,string name,string cid,bool status);
    //转赠事件
    event Give(address indexed from,address indexed to, uint256 tokenId);

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

    //个人的nft集合
    mapping(address => mapping(uint256 => nftProperty)) nftOwner;

    //tokenId在个人所有拥有nft的序号
    mapping(address => mapping(uint256 => uint256)) personalNftOrder;

    //nft的总数量
    uint256 nftAmount;

    constructor() ERC721("nft","NFT"){}

    //铸造
    function mint(uint256 _tokenId,string memory _name,string memory _cid) external{
        nftProperty memory nft = nftProperty({
            id: nftAmount,
            tokenId: _tokenId,
            cid: _cid,
            name: _name,
            author: msg.sender
        });
        nfts[nftAmount] = nft;

        nftOwner[msg.sender][balanceOf(msg.sender)] = nft;

        personalNftOrder[msg.sender][_tokenId] = balanceOf(msg.sender);

        _mint(msg.sender, _tokenId);

        nftAmount++;

        emit Mint(msg.sender,_tokenId,_name,_cid,true);
    }

    //获取单个nft的信息
    function getProperty(uint256 id) external view returns(uint256,string memory,string memory,address){
        nftProperty memory nft = nfts[id];
        return (nft.tokenId,nft.cid,nft.name,nft.author);
    }

    //获取个人nft的信息
    function getPersonalNFT(uint256 id) external view returns(uint256,string memory,string memory,address){
        nftProperty memory nft = nftOwner[msg.sender][id];
        return (nft.tokenId,nft.cid,nft.name,nft.author);
    }

    //查询nft的总量
    function getNFTAmount() external view returns(uint256){
        return nftAmount;
    }

    //转赠
    function give(address to,uint256 tokenId) external {
        //获赠者
        nftOwner[to][balanceOf(to)] = nftOwner[msg.sender][personalNftOrder[msg.sender][tokenId]];
        personalNftOrder[to][tokenId] = balanceOf(to);

        //转赠者
        nftProperty memory nft = nftOwner[msg.sender][balanceOf(msg.sender)];

        nftOwner[msg.sender][personalNftOrder[msg.sender][tokenId]] = nft;
        personalNftOrder[msg.sender][nft.tokenId] = personalNftOrder[msg.sender][tokenId];

        delete nftOwner[msg.sender][balanceOf(msg.sender)];
        delete personalNftOrder[msg.sender][tokenId];

        _transfer(msg.sender, to, tokenId);
        emit Give(msg.sender, to, tokenId);
    }
}