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
        //铸造时间
        uint256 mintTime;
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

        uint256 left;

        uint256 createTime;
    }

    //id -> nft
    mapping(uint256 => nftProperty) nftMap;

    //id -> sell
    mapping(uint256 => nftSell) sellMap;

    //cid ->sellId
    mapping(string => uint256) sellId;

    //tokenId -> id
    mapping(uint256 => uint256) tokenIdToId;

    //个人的nft集合
    mapping(address => mapping(uint256 => nftProperty)) nftOwner;

    //tokenId在个人所有拥有nft的序号
    mapping(address => mapping(uint256 => uint256)) personalNftOrder;

    mapping(string => bool) cidStatus;

    //nft的总数量
    uint256 nftAmount;

    uint256 sellAmount;

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
            amount: _amount,
            left: _amount,
            createTime: block.timestamp
        });

        sellMap[sellAmount] = newSellNft;
        sellId[_cid] = sellAmount;
        sellAmount++;
    }

    //显示sell
    function showSell(uint256 _id) external view returns(string memory,string memory,uint256,uint256,string memory,address,uint256,uint256){
        nftSell memory sellNft = sellMap[_id];
        return (sellNft.cid,sellNft.description,sellNft.price,sellNft.amount,sellNft.name,sellNft.author,sellNft.createTime,sellNft.left);
    }

    //显示sell
    function showSellByCid(string memory _cid) external view returns(string memory,string memory,uint256,uint256,string memory,address,uint256,uint256){
        nftSell memory sellNft = sellMap[sellId[_cid]];
        return (sellNft.cid,sellNft.description,sellNft.price,sellNft.amount,sellNft.name,sellNft.author,sellNft.createTime,sellNft.left);
    }

    //购买
    function getSellNFT(uint256 _tokenId, string memory _cid) external{
        nftSell memory sellNft = sellMap[sellId[_cid]];

        mint(_tokenId, sellNft.name, _cid, sellNft.description, 0, sellNft.price, false);
        nftMap[tokenIdToId[_tokenId]].author = sellNft.author;

        sellNft.left--;
        sellMap[sellId[_cid]] = sellNft;
    }

    function getSellAmount() external view returns(uint256){
        return sellAmount;
    }

    //铸造
    function mint(
        uint256 _tokenId,
        string memory _name,
        string memory _cid,
        string memory _description,
        uint256 _activityId,
        uint256 _price,
        bool _status) public{
        nftProperty memory nft = nftProperty({
            id: nftAmount,
            tokenId: _tokenId,
            cid: _cid,
            name: _name,
            author: msg.sender,
            description: _description,
            activityId: _activityId,
            price:_price,
            status: _status,
            mintTime: block.timestamp
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
    function getProperty(uint256 id) external view returns(uint256,string memory,string memory,address,address,string memory,uint256,bool,uint256,uint256){
        nftProperty memory nft = nftMap[id];
        return (nft.tokenId,nft.cid,nft.name,nft.author,ownerOf(nft.tokenId),nft.description,nft.activityId,nft.status,nft.price,nft.mintTime);
    }

    function getPropertyByTokenId(uint256 _tokenId) external view returns(uint256,string memory,string memory,address,address,string memory,uint256,bool,uint256,uint256){
        nftProperty memory nft = nftMap[tokenIdToId[_tokenId]];
        return (nft.tokenId,nft.cid,nft.name,nft.author,ownerOf(nft.tokenId),nft.description,nft.activityId,nft.status,nft.price,nft.mintTime);
    }

    //获取个人nft的信息
    function getPersonalNFT(uint256 id) external view returns(uint256,string memory,string memory,address,string memory,uint256,bool,uint256,uint256){
        nftProperty memory nft = nftOwner[msg.sender][id];
        return (nft.tokenId,nft.cid,nft.name,nft.author,nft.description,nft.activityId,nft.status,nft.price,nft.mintTime);
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