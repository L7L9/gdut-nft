// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Activity{
    //发起活动的事件
    event Initiate(address indexed host,string name,uint128 amount,string password);

    //活动结束的事件
    event End(uint256 indexed id,string name);

    struct activityProperty{
        //活动id
        uint256 id;
        //nft的cid
        uint256 nftCid;
        //活动名称
        string name;
        //活动描述
        string description;
        //密码
        string password;
        //nft数量
        uint128 amount;
        //标记送出的nft
        uint128 index;
    }

    mapping(uint256 => activityProperty) activities;

    //活动的总数量（从1开始）
    uint256 activityAmount;

    constructor() {
        activityAmount = 1;
    }

    //发起抽奖活动的函数
    function initiate(string memory _name,string memory _description,uint128 _amount,uint256 _nftCid,string memory _password) external{
        activityProperty memory activity = activityProperty({
            id: activityAmount,
            nftCid: _nftCid,
            name: _name,
            description: _description,
            password: _password,
            amount: _amount,
            index : 0
        });

        activities[activityAmount] = activity;
        activityAmount++;

        emit Initiate(msg.sender,_name,_amount,_password);
    }

    //获取活动信息的函数
    function getActivityProperty(uint256 id) external view returns(string memory,string memory){
        activityProperty memory activity = activities[id];
        return (activity.name,activity.description);
    }

}