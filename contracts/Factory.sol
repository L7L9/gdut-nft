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
        //nft描述
        string description;
        //是否是活动的nft: 0=>不是活动发行  其他=>活动发行 
        uint256 activityId;
        //价格
        uint256 price;
        //是否卖(true卖，false不卖)
        bool status;
    }

    struct nftSell{
        //ipfs中的cid
        string cid;
        //nft名字
        string name;
        //作者
        address author;
        //nft描述
        string description;
        //价格
        uint256 price;

        uint256 amount;
    }

    //id -> nft
    mapping(uint256 => nftProperty) nftMap;

    mapping(string => nftSell) sellMap;

    //tokenId -> id
    mapping(uint256 => uint256) tokenIdToId;

    //个人的nft集合
    mapping(address => mapping(uint256 => nftProperty)) nftOwner;

    //tokenId在个人所有拥有nft的序号
    mapping(address => mapping(uint256 => uint256)) personalNftOrder;

    mapping(string => bool) cidStatus;

    //nft的总数量
    uint256 nftAmount;

    constructor() ERC721("nft","NFT"){}

    modifier Owner(uint256 _tokenId,address owner){
        require(owner == ownerOf(_tokenId));
        _;
    }

    function createSell(
        string memory _cid,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _amount
    ) external{
        nftSell memory newSellNft = nftSell({
            cid: _cid,
            name: _name,
            author: msg.sender,
            description: _description,
            price: _price,
            amount: _amount
        });

        sellMap[_name] = newSellNft;
    }

    function getSellNFT(string memory _name) external returns(string memory,string memory,uint256,uint256){
        nftSell memory sellNft = sellMap[_name];
        sellNft.amount--;
        sellMap[_name] = sellNft;
        return (sellNft.cid,sellNft.description,sellNft.price,sellNft.amount);
    }

    //铸造
    function mint(
        uint256 _tokenId,
        string memory _name,
        string memory _cid,
        string memory _description,
        uint256 _activityId,
        uint256 _price,
        bool _status) external{
        nftProperty memory nft = nftProperty({
            id: nftAmount,
            tokenId: _tokenId,
            cid: _cid,
            name: _name,
            author: msg.sender,
            description: _description,
            activityId: _activityId,
            price:_price,
            status: _status
        });
        nftMap[nftAmount] = nft;

        tokenIdToId[_tokenId] = nftAmount;

        nftOwner[msg.sender][balanceOf(msg.sender)] = nft;

        personalNftOrder[msg.sender][_tokenId] = balanceOf(msg.sender);

        _mint(msg.sender, _tokenId);

        nftAmount++;

        emit Mint(msg.sender,_tokenId,_name,_cid,true);
    }

    //获取单个nft的信息
    function getProperty(uint256 id) external view returns(uint256,string memory,string memory,address,address,string memory,uint256,bool,uint256){
        nftProperty memory nft = nftMap[id];
        return (nft.tokenId,nft.cid,nft.name,nft.author,ownerOf(nft.tokenId),nft.description,nft.activityId,nft.status,nft.price);
    }

    function getPropertyByTokenId(uint256 _tokenId) external view returns(uint256,string memory,string memory,address,address,string memory,uint256,bool,uint256){
        nftProperty memory nft = nftMap[tokenIdToId[_tokenId]];
        return (nft.tokenId,nft.cid,nft.name,nft.author,ownerOf(nft.tokenId),nft.description,nft.activityId,nft.status,nft.price);
    }

    //获取个人nft的信息
    function getPersonalNFT(uint256 id) external view returns(uint256,string memory,string memory,address,string memory,uint256,bool,uint256){
        nftProperty memory nft = nftOwner[msg.sender][id];
        return (nft.tokenId,nft.cid,nft.name,nft.author,nft.description,nft.activityId,nft.status,nft.price);
    }

    //查询nft的总量
    function getNFTAmount() external view returns(uint256){
        return nftAmount;
    }

    //转赠
    function give(address to,uint256 tokenId) external Owner(tokenId,msg.sender) {
        transfer(msg.sender, to, tokenId);
    }
    //购买
    function transferFromOwner(address from,address to,uint256 tokenId) external Owner(tokenId,from){
        transfer(from, to, tokenId);
    }

    function transfer(address from,address to,uint256 tokenId) private{
        require(from != to,"do not allow give yourself");
        //获赠者
        nftOwner[to][balanceOf(to)] = nftOwner[from][personalNftOrder[from][tokenId]];
        personalNftOrder[to][tokenId] = balanceOf(to);

        //转赠者
        nftProperty memory nft = nftOwner[from][balanceOf(from)-1];

        nftOwner[from][personalNftOrder[from][tokenId]] = nft;
        personalNftOrder[from][nft.tokenId] = personalNftOrder[from][tokenId];
        
        nftMap[tokenIdToId[tokenId]].status = false;

        delete nftOwner[from][balanceOf(from)-1];
        delete personalNftOrder[from][tokenId];

        _transfer(from, to, tokenId);
        emit Give(from, to, tokenId);
    }

    function setStatus(uint256 _tokenId,bool _status,uint256 _price) external{
        require(_status == !nftMap[tokenIdToId[_tokenId]].status,"already this status");
        if(_status){
            nftMap[tokenIdToId[_tokenId]].price = _price;
        }
        nftMap[tokenIdToId[_tokenId]].status = _status;
    }

    function setCidStatus(string memory cid) external{
        cidStatus[cid] = true;
    }

    function getCidStatus(string memory cid) external view returns(bool){
        return cidStatus[cid];
    }

    function getNftPrice(uint256 tokenId) external view returns(uint256){
        require(ownerOf(tokenId) != address(0),"this token does not exist");
        return nftMap[tokenIdToId[tokenId]].price;
    }
}