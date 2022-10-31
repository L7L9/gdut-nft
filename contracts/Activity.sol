// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Activity{
    //发起活动的事件
    event Initiate(address indexed host,string name,uint256 amount,string password);

    //活动结束的事件
    event End(uint256 indexed id,string name);

    struct activityProperty{
        //活动id
        uint256 id;
        //nft的cid
        string nftCid;
        //活动名称
        string name;
        //活动描述
        string description;
        //密码
        bytes32 password;
        //nft数量
        uint256 amount;
        //活动发起人
        address host;
        //活动是否存在
        bool isExist;
    }
    
    struct nft{
        string name;

        string des;

        uint256 amount;
    }
    mapping(uint256 => activityProperty) activities;

    mapping(uint256 => nft) nftMap;

    mapping(string => bool) activityCidStatus;

    //活动的总数量（从1开始）
    uint256 activityAmount;

    constructor() {
        activityAmount = 1;
    }

    //发起活动的函数
    function initiate(
        string memory _name,
        string memory _description,
        uint256 _amount,
        string memory _nftCid,
        string memory _password,
        string memory nftName,
        string memory nftDes) external{
        require(!activityCidStatus[_nftCid],"this picture already used");
        activityProperty memory activity = activityProperty({
            id: activityAmount,
            nftCid: _nftCid,
            name: _name,
            description: _description,
            password: keccak256(abi.encode(_password)),
            amount: _amount,
            host: msg.sender,
            isExist: true
        });

        nft memory newNft = nft({
            name: nftName,
            des: nftDes,
            amount: _amount
        });
        nftMap[activityAmount] = newNft;
        activities[activityAmount] = activity;
        activityAmount++;

        activityCidStatus[_nftCid] = true;

        emit Initiate(msg.sender,_name,_amount,_password);
    }

    //获取活动中的nft
    function getActivityNFT(uint256 id,string memory _password) external 
    returns(
        string memory,
        uint256,
        string memory,
        string memory){
        activityProperty memory activity = activities[id];
        require(keccak256(abi.encode(_password)) == activity.password,"password is wrong");

        nft memory nftObj = nftMap[id];
        require(nftObj.amount > 0,"nft is not enough");
        nftObj.amount--;
        if(nftObj.amount == 0){
            activity.isExist = false;
            emit End(activity.id, activity.name);
        }
        nftMap[id] = nftObj;
        return (activity.nftCid,nftObj.amount,nftObj.name,nftObj.des);
    }

    function showActivityNFT(uint256 id) external view returns(string memory,string memory,uint256){
        nft memory nftObj = nftMap[id];
        return (nftObj.name,nftObj.des,nftObj.amount);
    }

    //获取活动信息的函数
    function getActivityProperty(uint256 id) external view returns(string memory,string memory,uint256,address,string memory,uint256,bool){
        activityProperty memory activity = activities[id];
        return (activity.name,activity.description,activity.id,activity.host,activity.nftCid,activity.amount,activity.isExist);
    }

    //获取活动中nft数量
    function getActivityNFTAmount(uint256 id) external view returns(uint256){
        return activities[id].amount;
    }

    //获取活动总量
    function getActivityAmount() external view returns(uint256){
        return activityAmount;
    }

    function getActivityCidStatus(string memory cid) external view returns(bool){
        return activityCidStatus[cid];
    }
}