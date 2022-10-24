import Web3 from "web3";
const ipfsAPI = require('ipfs-api');

import factoryArtifact from "../../build/contracts/Factory.json";
import activityArtifact from "../../build/contracts/Activity.json";

import {message} from 'antd'

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//artivity合约实例
var activity = null;
//ipfs实例
var ipfs = null;
//当前账户
var account = null;
//用户数据库(用于配对用户名和用户链上id)
var userDB = new PouchDB("user_db");
//nft链下数据库
var nftDB = new PouchDB("nft_db");
//activty链下数据库
var activityDB = new PouchDB("activity_db");

// userDB.destroy();
// nftDB.destroy();
// activityDB.destroy();

const init = {
    getAccount: async function(){
        account = sessionStorage.getItem("account");
    },
    getSolidityObject: async function(){
        const networkId = await new web3.eth.net.getId();
        factory = new web3.eth.Contract(
            factoryArtifact.abi,
            factoryArtifact.networks[networkId].address
        );
        activity = new web3.eth.Contract(
            activityArtifact.abi,
            activityArtifact.networks[networkId].address
        )
    },
    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    login: async function (userName, password) {
        var tempAccount = null;
        userDB.find({
            selector: {
                userName : userName
            },
        }).then(async (result)=>{
            if(null!=result.docs[0]){
                try{
                    tempAccount = result.docs[0]._id;
                    await web3.eth.personal.unlockAccount(tempAccount,password,10).then((res,err) =>{
                        if(err)throw err;
                        if (res == true) {
                            sessionStorage.setItem("account",tempAccount);
                            account = tempAccount;
                            message.success("登陆成功", 1);
                            sessionStorage.setItem('islogin',true)
                        }
                    })
                } catch (err) {
                    message.error("密码错误", 1);
                    sessionStorage.setItem('islogin',false)
                }
            } else {
                message.error("账号不存在", 1);
                sessionStorage.setItem('islogin',false)
            }
        })
    },

    register: async function(userName,password){
        userDB.find({
            selector: {
                userName : userName
            },
        }).then(async (result)=>{
            if(null!=result.docs[0]){
                message.info("用户名重复",1);
            }else{
                try {
                    web3.eth.personal.newAccount(password).then(function(res,err){
                        if(err)throw err;
                        //优化交互体验
                        var doc = {
                            _id : res,//用户链上id
                            userName : userName//用户名
                        }
                        userDB.put(doc, function(err, response) {
                            if (err) {
                                throw err;
                            } else {
                                message.success("注册成功,返回登陆页面",1);
                                setTimeout(() => {
                                    window.location.replace("http://localhost:8081");
                                },1000)
                            }
                        });
                    })
                } catch (err) {
                    message.error("注册失败，再试试？",1)
                }
            }
        })
    },
    logout: async function(){
        account = null;
        sessionStorage.removeItem("account");
        window.location.replace("http://localhost:8081");
    }
}

const nftModel = {
    //创建nft
    create: async function(name0,des0){
        var file = document.querySelector("#nft").files;
        var name = name0;
        var des = des0;
        if (file.length != 0) {
            //将文件存入ipfs中并获取cid
            var cid = null;
            var tokenId = null;
            // console.log(file[0]);
            var reader = new FileReader();
            //读取文件转为buffer以上传
            reader.readAsArrayBuffer(file[0]);
            reader.onloadend = async function(){
                // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);

                cid = cids[0].hash;
                // console.log("cid:" + cid);

                tokenId = web3.utils.sha3(cid);
                await nftModel.mint(name, des, cid, 1, 0).then(() => {
                    return new Promise((reslove,reject)=> {
                        reslove(true)
                    });
                });
                
            }
        } else {
            return new Promise((reslove,reject) => {
                reject(false)
            });
        }
        
        
    },

    //铸造nft
    mint: async function(name,message,cid,amount,status){
        console.log(amount);
        //转入以太以便使用
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        var _transfer = {
            from:defaultAccount,
            to:account,
            value: web3.utils.toWei('1','ether')
        };

        await web3.eth.sendTransaction(_transfer);
        //调用合约的铸造方法
        const { mint } = factory.methods;
        for(let i = 0;i < amount;i++){
            var tokenId = web3.utils.sha3(cid+i);
            await mint(tokenId,name,cid,message,status).send({
                from: account,
                gas: 1000000
            }).then((res) =>{
                console.log(res);
            })
            var doc = {
                _id : tokenId,
                name : name,
                cid : cid,
                message : message,
                author : account,
                status : status
            }
            nftDB.put(doc, function(err, response) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log("Document created Successfully");
                }
            });
        }
    },

    //赠送
    give: async function(){
        var tokenId = prompt("请输入要送出nft的tokenId:","请在此输入");
        if(tokenId != null){
            var to = prompt("请输入要送给的账户：","请在此输入");
            if(to != null){
                // console.log(tokenId);
                // console.log(to);
                const { give } = factory.methods;
                //转入以太以便调用方法
                const accounts = await web3.eth.getAccounts();
                var defaultAccount = accounts[0];
                // console.log(defaultAccount);  
                var _transfer = {
                    from:defaultAccount,
                    to:account,
                    value: web3.utils.toWei('1','ether')
                };

                await web3.eth.sendTransaction(_transfer);

                await give(to,tokenId).send({from:account,gas:1000000}).then(res=>{
                    console.log(res);
                });
                //刷新页面
                pageModel.showMyNFT();
            }
        } 
    },
    //搜索
    search: async function(value){
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var content;
        var url;
        var res = [];
        var ipfsResult;
        const res1=await nftDB.find({
            selector: {
                name:{"$regex": regExp},
                status:0
            },
        }).then(async function(result){
            for (let i = 0; result.docs[i] != null; i++){
                console.log(result.docs[i])
                ipfsResult = await ipfs.get(result.docs[i].cid);
                content = ipfsResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                res.push({
                    url,
                    tokenId: result.docs[i]._id,// res[0]//tokenId
                    cid: result.docs[i].cid,// res[1]//ipfs中的cid
                    nftname: result.docs[i].name, // res[2]//nft名字
                    author: result.docs[i].author,// res[3]//作者
                    des: result.docs[i].message,// res[4]//nft描述
                    number:result.docs[i].status// res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                })
            }
            console.log(res);
            return new Promise(reslove => {
                reslove(res)
            })
        })
        return res1;
    }
}

const activityModel = {
    //创建活动
    initiateActivity: async function(name,message1,amount,password,nftName,nftMessage){
        const { initiate } = activity.methods;
        const { getActivityAmount } = activity.methods;
        var file = document.querySelector("#anft").files;

        var cid = null;

        if (file.length !== 0) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file[0]);
            reader.onloadend = async function(){
            // console.log(reader.result);
            var img = Buffer.from(reader.result);
            // console.log("前："+img);
            var cids = await ipfs.add(img);

            cid = cids[0].hash;
            var activityId = await getActivityAmount().call({from:account});
            nftModel.mint(nftName,nftMessage,cid,amount,activityId);

            const accounts = await web3.eth.getAccounts();
            var defaultAccount = accounts[0];
            // console.log(defaultAccount);  

            var doc = {
                _id:activityId,
                name:name,
                message:message1,
                amount:amount,
                cid:cid,
                nftName:nftName,
                nftMessage:nftMessage
            }
            activityDB.put(doc, function(err, response) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log("Document created Successfully");
                }
            }).then(
                await web3.eth.sendTransaction({
                from:defaultAccount,
                to:account,
                value: web3.utils.toWei('1','ether')
            })).then(await initiate(name,message1,amount,cid,password).send({
                from:account,
                gas:1000000
            }).then(res=>{
                console.log(res);
                return new Promise((reslove, reject) => {
                    message.success("创建活动成功");
                    reslove(true)
                })
                //刷新活动页面
            }))
            }
        } else {
            return new Promise((reslove, reject) => {
                message.error('创建失败，你没有选择文件',1)
                reject(false)
            })
        }
    },

    //领取活动nft
    getNFT: async function(num,id,password){
        // console.log(num);
        //获取输入的领取密钥
        if(password.trim() != ''){
            const { getActivityNFT } = activity.methods;
            const { give } = factory.methods;
            //活动id
            // var activityId = document.getElementById("activityId"+num).innerText;
            var activityId = id;
            console.log(activityId);
            
            //转入以太以便调用方法
            const accounts = await web3.eth.getAccounts();
            var defaultAccount = accounts[0];
            // console.log(defaultAccount);  

            await web3.eth.sendTransaction({
                from:defaultAccount,
                to:account,
                value: web3.utils.toWei('1','ether')
            });

            await getActivityNFT(activityId,password).call().then(async function(res){
                console.log(res);

                var tokenId = web3.utils.sha3(res[0] + res[1]); 

                await web3.eth.sendTransaction({
                    from:defaultAccount,
                    to:res[2],
                    value: web3.utils.toWei('1','ether')
                });
                await give(account,tokenId).send({
                    from:res[2],
                    gas:1000000
                }).then((res)=>{
                    console.log(res);
                })
            })
            await getActivityNFT(activityId,password).send({
                from:account,
                gas:1000000
            }).on("receipt",function(receipt){
                console.log(receipt);
            })
        }
        else message.error('您没有密钥或输入的密钥为空字符串',1)
    },
    //搜索活动
    search: async function(value){
        var regExp = new RegExp('.*' + value + '.*', 'i');
        activityDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(function(result){
            for(let i=0;result.docs[i]!=null;i++){
                // _id,name,message,amount,cid,nftName,nftMessage
                console.log(result.docs[i].name);
            }
        })
    }
}

const pageModel = {
    showNumber: 4,

    indexId: 0,

    activityHomeIndex: 1,

    showMyNFT: async function(){
        const { getPersonalNFT } = factory.methods;
        const { balanceOf } = factory.methods;

        //获取个人拥有的nft数量
        var amount = await balanceOf(account).call();

        //用于接受文件内容
        var content = null;
        //用于获取ipfs中的cid
        var cid = null;
        //用于获取url
        var url = null;

        var result = [];
        if(amount > 0){
            for(let i = 0; i < amount; i++){
                await getPersonalNFT(i).call({from:account}).then((res)=>{

                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        //nft图片
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]))

                        result.push({
                            url,
                            tokenId: res[0],
                            cid: res[1],
                            nftname: res[2],
                            author: res[3],
                            des: res[4],
                            number:res[5]
                        })
                        //将res中数据渲染到前端
                        // res[0]//tokenId
                        // res[1]//ipfs中的cid
                        // res[2]//nft名字
                        // res[3]//作者
                        // res[4]//nft描述
                        // res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行 
                    })       
                })
            }
        } 

        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },

    showAllNFT: async function(){
        const { getNFTAmount } = factory.methods;
        const { getActivityNFTAmount } = activity.methods;
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        //获取nft总量
        var NFTAmount = await getNFTAmount().call();

        var result = [];
        if (NFTAmount > 0) {
            //用于接受文件内容
            var content = null;
            //用于获取ipfs中的cid
            var cid = null;
            //用于获取url
            var url = null;

            for (let num1 = 0; num1 < NFTAmount; num1++) {
                var res = await getProperty(num1).call();
                cid = res[1];
                await ipfs.get(cid, function (err, files) {
                    if (err) throw err;

                    //nft图片
                    content = files[0].content;
                    url = window.URL.createObjectURL(new Blob([content]));
                    result.push(
                        {
                            url,
                            tokenId: res[0],
                            cid: res[1],
                            nftname: res[2],
                            author: res[3],
                            nftdes: res[4],
                            nft: res[5]
                        });
                    // res[0]//tokenId
                    // res[1]//ipfs中的cid
                    // res[2]//nft名字
                    // res[3]//作者
                    // res[4]//nft描述
                    // res[5]//是否是活动的nft: 0=>不是活动发行  其他=>活动发行 
                })
                if (res[5] != 0) {
                    //因为一个活动可能有多个nft，它们有相同的图片，故需num += addAmount防止展示同一张nft多次
                    var addAmount = await getActivityNFTAmount(res[5]).call();//一个活动的nft数量
                    num1 += (addAmount - 1);
                }
            }
        }
        return new Promise((reslove, reject) => {
            reslove (result)
        });
    }, 

    showAllActivities: async function(){
        const { getActivityAmount } = activity.methods;

        //获取活动总量
        var amount = await getActivityAmount().call();
        var result = [];
        if(amount > 1){
            const { getActivityProperty } = activity.methods;
            var res = null;
            var content = null;
            var url = null;
            var getResult = null;
            for(let num = 1;num < amount; num++){
                res = await getActivityProperty(num).call();
                getResult = await ipfs.get(res[4]);
                //res: 0=>活动名  1=>活动描述  2=>活动id  3=>活动发起者 4=>该活动nft的cid 5=>该活动发行nft数量
                // console.log(getResult);
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                // var img = document.getElementById("num"+num);
                // img.src = url; 
                result.push({
                    url,
                    name: res[0],
                    des: res[1],
                    id: res[2],
                    person: res[3],
                    nftcid: res[4],
                    number:res[5]
                });
            }
            
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },

    //图片预览
    preview: async function(){
        var files = document.querySelector("#nft").files;
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onloadend = async function(){
            console.log(reader.result);
            var file = Buffer.from(reader.result);

            var url = window.URL.createObjectURL(new Blob([file]));

            var img = document.getElementById("nftShower");
            img.src = url;
        }
    },
    apreview: async function(){
        var files = document.querySelector("#anft").files;
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onloadend = async function(){
            console.log(reader.result);
            var file = Buffer.from(reader.result);

            var url = window.URL.createObjectURL(new Blob([file]));

            var img = document.getElementById("anftShower");
            img.src = url;
        }
    },

    getMaxHomePage: function(){
        const { getNFTAmount } = factory.methods;
        var amount = getNFTAmount().call();
        return amount;
    },
    
    getMaxPersonalPage: async function(){
        const { balanceOf } = factory.methods;
        var amount = balanceOf(account).call();
        return amount;
    }
}

window.accountModel = accountModel;
window.nftModel = nftModel;
window.pageModel = pageModel;
window.activityModel = activityModel;

window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取合约实例
    await init.getSolidityObject();
    
    //获取ipfs实例
    init.getIpfs();

    init.getAccount();

    var url = window.location.href;
    if(url == "http://localhost:8081/home.html"){
        pageModel.showAllNFT();
    }
    if(url == "http://localhost:8081/myInformation.html"){
        pageModel.showMyNFT();
    }    
    if(url == "http://localhost:8081/activity.html"){
        pageModel.showAllActivities();
    }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </HashRouter>)