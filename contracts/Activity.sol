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
        string password;
        //nft数量
        uint256 amount;
        //活动发起人
        address host;
    }

    mapping(uint256 => activityProperty) activities;

    //活动的总数量（从1开始）
    uint256 activityAmount;

    //活动nft的总量-活动量：用于主页计算真实的展示nft个数
    uint256 amountForCount;

    constructor() {
        activityAmount = 1;
    }

    //发起活动的函数
    function initiate(string memory _name,string memory _description,uint256 _amount,string memory _nftCid,string memory _password) external{
        activityProperty memory activity = activityProperty({
            id: activityAmount,
            nftCid: _nftCid,
            name: _name,
            description: _description,
            password: _password,
            amount: _amount,
            host: msg.sender
        });

        amountForCount += (_amount - 1);
        activities[activityAmount] = activity;
        activityAmount++;

        emit Initiate(msg.sender,_name,_amount,_password);
    }

    //获取活动中的nft
    function getActivityNFT(uint256 id,string memory _password) external returns(string memory,uint256,address){
        activityProperty memory activity = activities[id];
        require(keccak256(bytes(_password)) == keccak256(bytes(activity.password)),"password is wrong");
        require(activity.amount > 0,"activity is over");
        activity.amount--;
        if(activity.amount == 0){
            emit End(activity.id, activity.name);
        }
        return (activity.nftCid,activity.amount,activity.host);
    }

    //获取活动信息的函数
    function getActivityProperty(uint256 id) external view returns(string memory,string memory,uint256,address){
        activityProperty memory activity = activities[id];
        return (activity.name,activity.description,activity.id,activity.host);
    }

    //获取活动中nft数量
    function getActivityNFTAmount(uint256 id) external view returns(uint256){
        return activities[id].amount;
    }

    //获取amountForCount
    function getCountAmount() external view returns(uint256){
        return amountForCount;
    }

    //获取活动总量
    function getActivityAmount() external view returns(uint256){
        return activityAmount;
    }
}