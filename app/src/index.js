import Web3 from "web3";
const ipfsAPI = require('ipfs-api');

import factoryArtifact from "../../build/contracts/Factory.json";
import activityArtifact from "../../build/contracts/Activity.json";
import userArtifact from "../../build/contracts/User.json";
import noticeArtifact from "../../build/contracts/Notice.json";

import { message } from 'antd'


//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//artivity合约实例
var activity = null;
//user合约实例
var userSolidity = null;
var noticeSolidity = null;
//ipfs实例
var ipfs = null;
//当前账户address
var account = null;
//nft链下数据库
var nftDB = new PouchDB("nft_db");
//activty链下数据库c
var activityDB = new PouchDB("activity_db");

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
        );
        userSolidity = new web3.eth.Contract(
            userArtifact.abi,
            userArtifact.networks[networkId].address
        );
        noticeSolidity = new web3.eth.Contract(
            noticeArtifact.abi,
            noticeArtifact.networks[networkId].address
        );
    },
    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    defaultAccountNum: 1,
    getEth: async function(name){
        const { getAddressByName } = userSolidity.methods;

        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[this.defaultAccountNum];
        var address = await getAddressByName(name).call({from:defaultAccount});
        if(this.defaultAccountNum == 10){
            this.defaultAccountNum = 1;
        } else {
            this.defaultAccountNum += 1;
        }
        var _transfer = {
            from:defaultAccount,
            to:address,
            value: web3.utils.toWei('1','ether')
        };
        await web3.eth.sendTransaction(_transfer);
    },
    login: async function (userName, password) {
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        const { signIn } = userSolidity.methods;
        try {
            var address = await signIn(userName).call({from:defaultAccount});
            await web3.eth.personal.unlockAccount(address,password,10).then((res,err) =>{
                if(err){
                    message.error("密码错误", 1);
                    sessionStorage.setItem('islogin',false)
                    throw err;
                }
                if (res == true) {
                    sessionStorage.setItem("account",address);
                    account = address;
                    message.success("登陆成功", 1);
                    sessionStorage.setItem('islogin',true)
                }
            })
        } catch (error) {
            message.error("用户不存在或密码错误", 1);
            sessionStorage.setItem('islogin',false)
        }
    },
    register: async function(userName,password){
        const { signUp } = userSolidity.methods;
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        web3.eth.personal.newAccount(password).then(async function(res,err){
            if(err) throw err;
            
            await signUp(userName,res).send({
                from: defaultAccount,
                gas: 1000000
            }).on('error',function(error,receipt){
                message.info("用户名重复",1);
                throw error;
            })
        }).then(res=>{
            this.getEth(userName);
            message.success("注册成功,返回登陆页面",1);
            setTimeout(() => {
                window.location.replace("http://localhost:8081");
            },1000)
        })
    },
    logout: async function(){
        account = null;
        sessionStorage.removeItem("account");
        window.location.replace("http://localhost:8081");
    }
}

const nftModel = {
    setNftStatus: async function(status,price){
        const { setStatus } = factory.methods;

        if(!status){
            price = 0;
        }
        await setStatus(status,price).send({
            from:account,
            gas:1000000
        }).on('error',function(error,receipt){
            console.log("可能状态没变,查看error");
            throw error;
        }).then(function(res){
            console.log(res);
            message.success("设置成功");
        })
    },

    newCreate:async function(name, des, price, status, file0, amount){
        const { setCidStatus } = factory.methods;
        const { createSell } = factory.methods;
        const { getCidStatus } = factory.methods;
        const { createNotice } = noticeSolidity.methods;
        const { getUserInfoByAddress } = userSolidity.methods;

        if (file0.length != 0) {
            //将文件存入ipfs中并获取cid
            var cid = null;
            var reader = new FileReader();
            //读取文件转为buffer以上传
            reader.readAsArrayBuffer(file0[0]);
            reader.onloadend = async function () {
                
                // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);
                //返回的cid
                cid = cids[0].hash;
                var cidStatus = await getCidStatus(cid).call({});
                if(!cidStatus){
                    if(!status){
                        price = 0;
                        this.create(name, des, price, status, cid, amount);

                        await setCidStatus(cid).send({
                            from: account,
                            gas: 1000000
                        })
                    } else {       

                        var userInfo = await getUserInfoByAddress(account).call();
                        var userName = userInfo[0];

                        await createSell(cid, name,des, price, amount).send({
                            from: account,
                            gas: 1000000
                        })

                        await setCidStatus(cid).send({
                            from: account,
                            gas: 1000000
                        })

                        message.success("铸造完成", 1);
                        setTimeout(()=>{window.location.replace("http://localhost:8081/#/GDUT-nft/home")},100)
                        
                        var noticeDes = "用户(" + userName + ")创建了" + amount +"个藏品:" + name;
                        await createNotice("铸造个人藏品",noticeDes,0).send({
                            from: account,
                            gas: 1000000
                        }).then(res=>console.log(res))
                    }
                }   
            }
        } else {
            message.error('未选择文件，铸造失败', 1)
            return new Promise((reslove,reject) => {
                reject(false)
            });
        }
    },

    getSellNft: async function(id){
        const { buy } = userSolidity.methods;
        const { getMoney } = userSolidity.methods;
        const { getSellNFT } = factory.methods; 

        var result = await getSellNFT(id).call();
        var money = await getMoney().call({from:account});
        if(new Number(money) >= new Number(result[3])){
            try {
                await buy(price,owner).send({
                    from:account,
                    gas: 1000000
                }).on('error',function(error){
                    throw error;
                }).then(async function(){
                    if(result[3] >= 0){
                        this.create(result[4],result[1],result[2],true,result[0],result[3]);
                    } else {
                        message.error("数量不够",1)
                    }

                }).then(()=>{
                    message.success("购买成功");
                });
            } catch (error) {
                message.error("购买失败",1)
            }
        } else{
            message.error("您的余额不足",1);
        }
    },

    //创建nft
    create: async function (name, des, price, status, file0) {
        const { mint } = factory.methods;
        const { setCidStatus } = factory.methods;
        const { getCidStatus } = factory.methods;
        const { createNotice } = noticeSolidity.methods;
        const { getUserInfoByAddress } = userSolidity.methods;
        var userInfo = await getUserInfoByAddress(account).call();
        var userName = userInfo[0];
        if (file0.length != 0) {
            var tokenId = null;
            //将文件存入ipfs中并获取cid
            var cid = null;
            var reader = new FileReader();
            //读取文件转为buffer以上传
            reader.readAsArrayBuffer(file0[0]);
            reader.onloadend = async function () {     
            // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);
                //返回的cid
                cid = cids[0].hash;
                var cidStatus = await getCidStatus(cid).call({}); 
                if (!cidStatus) {
                    message.loading('正在创建',1)
                    if(!status){
                        price = 0;
                        // if(amount != 1){
                        //     message.error('非发行藏品只能铸造一个', 1)
                        //     return new Promise((reslove,reject) => {
                        //         reject(false)
                        //     });
                        // }
                }
                tokenId = web3.utils.sha3(name + cid);

                await mint(tokenId,name,cid,des,0,price,status).send({
                    from: account,
                    gas: 1000000
                }).then(async ()=>{
                    var doc = {
                        _id : tokenId,
                        name : name,
                        cid : cid,
                        author : userName,
                        price : parseInt(price)
                }
                nftDB.put(doc, function(err, response) {
                    if (err) {
                        console.log(err);
                        // throw err;
                    } else {
                        console.log("Document created Successfully");
                    }
                })
                });
                await setCidStatus(cid).send({
                    from: account,
                    gas: 1000000
                })
                message.success("铸造完成", 1);
                setTimeout(()=>{window.location.replace("http://localhost:8081/#/GDUT-nft/news")},100)
                
                var noticeDes = "用户(" + userName + ")创建了" +"一个藏品:" + name;
                await createNotice("铸造个人藏品",noticeDes,0).send({
                    from: account,
                    gas: 1000000
                }).then(res=>console.log(res))
                } else {
                    message.error("该图片已经使用过", 1);
                }
            }
        } else {
            message.error('未选择文件，铸造失败', 1)
            return new Promise((reslove,reject) => {
                reject(false)
            });
        }
    },
    //赠送
    give: async function (tokenId, to) {
        const { getAddressByName } = userSolidity.methods;
        const { give } = factory.methods;
        const { createNotice } = noticeSolidity.methods;
        try {
            var address = await getAddressByName(to).call({})
            await give(address,tokenId).send({from:account,gas:1000000}).then(res=>{
                return new Promise((reslove, reject) => {
                    reslove(res)
                })
            });
            var noticeDes = "用户(" + account + ")赠送了" + to + "一个藏品";
            await createNotice("赠送个人藏品",noticeDes,1).send({
                from: account,
                gas: 1000000
            }).then(res=>console.log(res))
        } catch (error) {
            return new Promise((reslove, reject) => {
                reject(error)
            })
        }
        //刷新页面
        // pageModel.showMyNFT();
    },
    buyNft: async function(owner,tokenId){
        const { buy } = userSolidity.methods;
        const { transferFromOwner } = factory.methods;
        const { getNftPrice } = factory.methods;
        const { getMoney } = userSolidity.methods;
        var money = await getMoney().call({from:account});
        var price = await getNftPrice(tokenId).call();
        if(new Number(money) >= new Number(price)){
            try {
                await buy(price,owner).send({
                    from:account,
                    gas: 1000000
                }).on('error',function(error){
                    throw error;
                }).then(async function(){
                    await transferFromOwner(owner,account,tokenId).send({
                        from:account,
                        gas: 1000000
                    }).on('error',function(error){
                        throw error;
                    })
                }).then(()=>{
                    message.success("购买成功");
                });
            } catch (error) {
                message.error("购买失败",1)
            }
        } else{
            message.error("您的余额不足",1);
        }
    },
    //搜索
    search: async function (value) {
        const { getUserInfoByAddress } = userSolidity.methods;
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var content;
        var url;
        var res = [];
        var ipfsResult;
        await nftDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(async function(result){
            for (let i = 0; result.docs[i] != null; i++){
                ipfsResult = await ipfs.get(result.docs[i].cid);
                content = ipfsResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                const { getPropertyByTokenId } = factory.methods;
                var temp = await getPropertyByTokenId(result.docs[i]._id).call();
                var authorInfo = await getUserInfoByAddress(temp[3]).call();
                var authorName = authorInfo[0];
                var ownerInfo = await getUserInfoByAddress(temp[4]).call();
                var ownerName = ownerInfo[0];
                res.push({
                    url,
                    tokenId: temp[0],//tokenId
                    nftName: temp[2],//nft名字
                    authorAddress: temp[3],//作者链上id
                    authorName: authorName,//作者用户名
                    ownerAddress: temp[4],//拥有者链上id
                    ownerName: ownerName,//拥有者名字
                    nftDes: temp[5],//nft描述
                    activityId:temp[6],//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                    status: temp[7],//是否能被购买
                    price: temp[8],//价格(若不能被购买则为0)  其他=>活动发行
                    mintTime: temp[9]
                })
            }   
        })
        return new Promise(reslove => {
            reslove(res)
        })
    },

    //搜索某位作者的所有作品
    searchByAuthor : async function (value){
        const { getUserInfoByAddress } = userSolidity.methods;
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var content;
        var url;
        var res = [];
        var ipfsResult;
        await nftDB.find({
            selector: {
                author:{"$regex": regExp},
            },
        }).then(async function(result){
            for (let i = 0; result.docs[i] != null; i++){
                console.log(result.docs[i])
                ipfsResult = await ipfs.get(result.docs[i].cid);
                content = ipfsResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                const { getPropertyByTokenId } = factory.methods;
                var temp = await getPropertyByTokenId(result.docs[i]._id).call();
                var authorInfo = await getUserInfoByAddress(temp[3]).call();
                var authorName = authorInfo[0];
                var ownerInfo = await getUserInfoByAddress(temp[4]).call();
                var ownerName = ownerInfo[0];
                res.push({
                    url,
                    tokenId: temp[0],//tokenId
                    nftName: temp[2],//nft名字
                    authorAddress: temp[3],//作者链上id
                    authorName: authorName,//作者用户名
                    ownerAddress: temp[4],//拥有者链上id
                    ownerName: ownerName,//拥有者名字
                    nftDes: temp[5],//nft描述
                    activityId:temp[6],//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                    status: temp[7],//是否能被购买
                    price: temp[8],//价格(若不能被购买则为0)  其他=>活动发行
                    mintTime: temp[9]
                })
            }     
        })
        return new Promise(reslove => {
            reslove(res)
        })
    },

    //多条件筛选
    select : async function (name,author,priceMin,priceMax){
        const { getUserInfoByAddress } = userSolidity.methods;
        var content;
        var url;
        var res = [];
        var ipfsResult;
        await nftDB.find({
            selector: {
                name:{"$regex": name==null?"":name},
                author:{"$regex": author==null?"":author},
                price:{
                    "$gte": priceMin==null?0:priceMin,
                    "$lte": priceMax==null?Number.MAX_SAFE_INTEGER:priceMax
                }
            },
        }).then(async function(result){
            for (let i = 0; result.docs[i] != null; i++){
                console.log(result.docs[i])
                ipfsResult = await ipfs.get(result.docs[i].cid);
                content = ipfsResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                const { getPropertyByTokenId } = factory.methods;
                var temp = await getPropertyByTokenId(result.docs[i]._id).call();
                var authorInfo = await getUserInfoByAddress(temp[3]).call();
                var authorName = authorInfo[0];
                var ownerInfo = await getUserInfoByAddress(temp[4]).call();
                var ownerName = ownerInfo[0];
                res.push({
                    url,
                    tokenId: temp[0],//tokenId
                    nftName: temp[2],//nft名字
                    authorAddress: temp[3],//作者链上id
                    authorName: authorName,//作者用户名
                    ownerAddress: temp[4],//拥有者链上id
                    ownerName: ownerName,//拥有者名字
                    nftDes: temp[5],//nft描述
                    activityId:temp[6],//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                    status: temp[7],//是否能被购买
                    price: temp[8],//价格(若不能被购买则为0)  其他=>活动发行
                    mintTime: temp[9]
                })
            }     
        })
        return new Promise(reslove => {
            reslove(res)
        })
    }
}

const activityModel = {
    //创建活动
    initiateActivity: async function(name,message1,amount,password,nftName,nftMessage,file){
        const { initiate } = activity.methods;
        const { getActivityAmount } = activity.methods;

        const { getUserInfoByAddress } = userSolidity.methods;

        const { createNotice } = noticeSolidity.methods;

        // var file = document.querySelector("#anft").files;

        var cid = null;

        var activityId = await getActivityAmount().call({from:account});

        if (file.length != 0) {
            const { setCidStatus } = factory.methods;
            const { getCidStatus } = factory.methods;
            var reader = new FileReader();
            reader.readAsArrayBuffer(file[0]);
            reader.onloadend = async function () {
                message.loading('正在加载',.5)
                // console.log(reader.result);
                var img = Buffer.from(reader.result);
                // console.log("前："+img);
                var cids = await ipfs.add(img);
                //获取cid
                cid = cids[0].hash;
                if(!await getCidStatus(cid).call({})){
                    await initiate(name,message1,amount,cid,password,nftName,nftMessage)
                    .send({
                        from:account,
                        gas: 1000000
                    })
                    .on('error',function(error,receipt){
                        message.error("创建失败");
                        throw error;
                    }).then(async function(res){
                        console.log(res)
                        await setCidStatus(cid).send({
                            from: account,
                            gas: 1000000
                        }).on('error',function(error){
                            throw error;
                        })
                        message.success("创建成功")
                        
                        var hostInfo = await getUserInfoByAddress(account).call();
                        var hostName = hostInfo[0];
                        var doc = {
                            _id:activityId,
                            name:name,
                            host:hostName
                        }
                        activityDB.put(doc, function(err, response) {
                            if (err) {
                                return console.log(err);
                            } else {
                                console.log("Document created Successfully");
                            }
                        })
                        
                        var noticeDes = "用户(" + hostName + ")创建了" + name + "活动";
                        await createNotice("创建活动",noticeDes,2).send({
                            from: account,
                            gas: 1000000
                        }).then(res => console.log(res))
                    })
                } else {
                    message.error("活动的nft图片已经使用过了", 1);
                    throw error;
                }
            }
        } else {
            message.error('创建失败，你没有选择文件',1)
            return new Promise((reslove, reject) => {
                reject(false)
            })
        }
    },
    //TODO
    //领取活动nft
    getNFT: async function (id, password) {
        if(password.trim() != ''){
            try {
                // message.loading('正在加载', 1);
                console.log("id:" + id);
                const { getActivityProperty } = activity.methods;
                const { getActivityNFTAmount } = activity.methods;
                const { getActivityNFT } = activity.methods;
                const { createNotice } = noticeSolidity.methods;
                // const { give } = factory.methods;
                const { mint } = factory.methods;

                var activityInfo = await getActivityProperty(id).call({});
                var nftAmount = await getActivityNFTAmount(id).call({});
                console.log("nft数量:" + nftAmount);
                var tokenId = null;
                //0=>cid  1=>nft索引 2=>nft名字  3=>nft描述 
                var result = await getActivityNFT(id,password).call({from:account});
                await getActivityNFT(id,password).send({
                    from:account,
                    gas:1000000
                }).on('error',function(error,receipt){
                    console.log("nft可能被领完,查看error");
                    throw error;
                }).then(async function(){
                    tokenId = web3.utils.sha3(result[2] + result[1] + result[0]);
                    await mint(tokenId,result[2],result[0],result[3],id,0,false).send({
                        from:account,
                        gas:1000000
                    })
                }).then(async ()=>{
                    const { getUserInfoByAddress } = userSolidity.methods;
                    var userInfo = await getUserInfoByAddress(account).call();
                    var userName = userInfo[0];
                    var hostInfo = await getUserInfoByAddress(activityInfo[3]).call();
                    var hostName = hostInfo[0];
                    var doc = {
                        _id : tokenId,
                        name : result[2],
                        author : hostName
                    }
                    nftDB.put(doc, function(err, response) {
                        if (err) {
                            return console.log(err);
                        } else {
                            message.success("领取成功,可前往个人信息查看")
                            console.log("Document created Successfully");
                        }
                    })
                    var noticeDes = "用户(" + userName + ")领取了" + result[4] + "活动的藏品";
                    await createNotice("领取活动藏品",noticeDes,3).send({
                        from: account,
                        gas: 1000000
                    }).then(res=>console.log(res))
                })
            } catch (error) {
                message.error('密码错误',1)
            }
        }
        else message.error('您没有密钥或输入的密钥为空字符串',1)
    },
    //搜索活动
    search: async function(value){
        const { getUserInfoByAddress } = userSolidity.methods;
        const { getActivityProperty } = activity.methods;
        const { showActivityNFT } = activity.methods;
        var regExp = new RegExp('.*' + value + '.*', 'i');
        var searchRes = [];
        var res = null;
        var content = null;
        var url = null;
        var getResult = null;
        var nftRes = null;
        await activityDB.find({
            selector: {
                name:{"$regex": regExp},
            },
        }).then(async function(result){
            for(let i=0;result.docs[i]!=null;i++){
                res = await getActivityProperty(result.docs[i]._id).call();
                getResult = await ipfs.get(res[4]);
                nftRes = await showActivityNFT(result.docs[i]._id).call();
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));

                var hostInfo = await getUserInfoByAddress(res[3]).call();
                var hostName = hostInfo[0];

                searchRes.push({
                    url,
                    name: res[0],//活动名字
                    des: res[1],//活动描述
                    id: res[2],//活动id
                    hostAddress: res[3],//活动举办者链上id
                    hostName: hostName,//活动举办者名字
                    amount:res[5],//发行nft数量
                    nftName:nftRes[0],//nft名字
                    nftDes: nftRes[1],//nft描述
                    nftRest: nftRes[2]//该活动还剩余可被领取的nft数量
                });
            }
            
        })
        return new Promise(reslove => {
            reslove(searchRes)
        })
    },
    //搜索某位举办者举办的所有活动(模糊搜索)
    searchByHost: async function(host){
        const { getUserInfoByAddress } = userSolidity.methods;
        const { getActivityProperty } = activity.methods;
        const { showActivityNFT } = activity.methods;
        var regExp = new RegExp('.*' + host + '.*', 'i');
        var searchRes = [];
        var res = null;
        var content = null;
        var url = null;
        var getResult = null;
        var nftRes = null;
        await activityDB.find({
            selector: {
                host:{"$regex": regExp},
            },
        }).then(async function(result){
            for(let i=0;result.docs[i]!=null;i++){
                res = await getActivityProperty(result.docs[i]._id).call();
                getResult = await ipfs.get(res[4]);
                nftRes = await showActivityNFT(result.docs[i]._id).call();
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));

                var hostInfo = await getUserInfoByAddress(res[3]).call();
                var hostName = hostInfo[0];

                searchRes.push({
                    url,
                    name: res[0],//活动名字
                    des: res[1],//活动描述
                    id: res[2],//活动id
                    hostAddress: res[3],//活动举办者链上id
                    hostName: hostName,//活动举办者名字
                    amount:res[5],//发行nft数量
                    nftName:nftRes[0],//nft名字
                    nftDes: nftRes[1],//nft描述
                    nftRest: nftRes[2]//该活动还剩余可被领取的nft数量
                });
            }
            
        })
        return new Promise(reslove => {
            reslove(searchRes)
        })
    },
    //搜索活动，根据举办者筛选
    selectByHost: async function(name,host){
        const { getUserInfoByAddress } = userSolidity.methods;
        const { getActivityProperty } = activity.methods;
        const { showActivityNFT } = activity.methods;
        var regExp = new RegExp('.*' + name + '.*', 'i');
        var searchRes = [];
        var res = null;
        var content = null;
        var url = null;
        var getResult = null;
        var nftRes = null;
        await activityDB.find({
            selector: {
                name:{"$regex": regExp},
                host:host
            },
        }).then(async function(result){
            for(let i=0;result.docs[i]!=null;i++){
                res = await getActivityProperty(result.docs[i]._id).call();
                getResult = await ipfs.get(res[4]);
                nftRes = await showActivityNFT(result.docs[i]._id).call();
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));

                var hostInfo = await getUserInfoByAddress(res[3]).call();
                var hostName = hostInfo[0];

                searchRes.push({
                    url,
                    name: res[0],//活动名字
                    des: res[1],//活动描述
                    id: res[2],//活动id
                    hostAddress: res[3],//活动举办者链上id
                    hostName: hostName,//活动举办者名字
                    amount:res[5],//发行nft数量
                    nftName:nftRes[0],//nft名字
                    nftDes: nftRes[1],//nft描述
                    nftRest: nftRes[2]//该活动还剩余可被领取的nft数量
                });
            }
            
        })
        return new Promise(reslove => {
            reslove(searchRes)
        })
    },
}

const pageModel = {
    showNumber: 4,

    indexId: 0,

    activityHomeIndex: 1,

    /**
     * 返回用户个人信息
     */
    showMe: async function(){
        const { getUserInfoByAddress } = userSolidity.methods;
        var result = await getUserInfoByAddress(account).call();
        var info = [];
        info.push(result[0]);//用户名
        info.push(account);//用户链上id
        info.push(result[1]);//拥有的money
        return info;
    },

    showSellNFT: async function(){
        const { getSellAmount } = factory.methods;
        const { getSellNFT } = factory.methods;

        var amount = await getSellAmount().call();
        if(amount > 0){
            var res = null;
            var ipfsReturn = null;
            var content = null;
            var url = null;
            for(let i = 0;i < amount;i++){
                res = await getSellNFT(i).call();
                //res[0]->cid  res[1]->description  res[2]->price  res[3]->amount  res[4]->name
                ipfsReturn = await ipfs.get(res[0]);
                content = ipfsReturn[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                result.push({
                    url,
                    id: i,
                    name: res[4],
                    description: res[1],
                    price: res[2],
                    amount: res[3]+1
                })
            }
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },

    showMyNFT: async function(){
        const { getPersonalNFT } = factory.methods;
        const { balanceOf } = factory.methods;
        const { getUserInfoByAddress } = userSolidity.methods;

        //获取个人拥有的nft数量
        var amount = await balanceOf(account).call();

        //用于接受文件内容
        var content = null;
        //用于获取ipfs中的cid
        var cid = null;
        //用于获取url
        var url = null;
        var res = null;
        var ipfsReturn = null;
        var result = [];
        if(amount > 0){
            for(let i = 0; i < amount; i++){
                res = await getPersonalNFT(i).call({from:account})
                cid = res[1];
                ipfsReturn = await ipfs.get(cid);
                content = ipfsReturn[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                var authorInfo = await getUserInfoByAddress(res[3]).call();
                var authorName = authorInfo[0];
                result.push({
                    url,
                    tokenId: res[0],//tokenId
                    nftName: res[2],//nft名字
                    authorAddress: res[3],//作者链上id
                    authorName:authorName,//作者用户名
                    nftDes: res[4],//nft描述
                    activityId:res[5],//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                    status: res[6],//是否能被购买
                    price: res[7],//价格(若不能被购买则为0)
                    mintTime: temp[8]
                })     
            }
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },
    
    showAllNFT: async function(){
        const { getNFTAmount } = factory.methods;
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        const { getUserInfoByAddress } = userSolidity.methods;
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
            var res = null;
            var ipfsReturn = null;
            for (let num1 = 0; num1 < NFTAmount; num1++) {
                res = await getProperty(num1).call();
                cid = res[1];
                ipfsReturn = await ipfs.get(cid)
                //nft图片
                content = ipfsReturn[0].content;
                url = window.URL.createObjectURL(new Blob([content]));
                var authorInfo = await getUserInfoByAddress(res[3]).call();
                var authorName = authorInfo[0];
                var ownerInfo = await getUserInfoByAddress(res[4]).call();
                var ownerName = ownerInfo[0];
                result.unshift({
                    url,
                    tokenId: res[0],//tokenId
                    nftName: res[2],//nft名字
                    authorAddress: res[3],//作者链上id
                    authorName: authorName,//作者用户名
                    ownerAddress: res[4],//拥有者链上id
                    ownerName: ownerName,//拥有者名字
                    nftDes: res[5],//nft描述
                    activityId:res[6],//是否是活动的nft: 0=>不是活动发行  其他=>活动发行
                    status: res[7],//是否能被购买
                    price: res[8],//价格(若不能被购买则为0)
                    mintTime: res[9]
                });
            }
        }
        return new Promise((reslove, reject) => {
            reslove (result)
        });
    }, 

    showAllActivities: async function(){
        const { getActivityAmount } = activity.methods;
        const { getUserInfoByAddress } = userSolidity.methods;
        //获取活动总量
        var amount = await getActivityAmount().call();
        var result = [];
        if(amount > 1){
            const { getActivityProperty } = activity.methods;
            const { showActivityNFT } = activity.methods;
            var res = null;
            var content = null;
            var url = null;
            var getResult = null;
            var nftRes = null;
            for(let num = 1;num < amount; num++){
                res = await getActivityProperty(num).call();
                getResult = await ipfs.get(res[4]);
                nftRes = await showActivityNFT(num).call();
                // nft图片
                content = getResult[0].content;
                url = window.URL.createObjectURL(new Blob([content]));

                var hostInfo = await getUserInfoByAddress(res[3]).call();
                var hostName = hostInfo[0];

                result.push({
                    url,
                    name: res[0],//活动名字
                    des: res[1],//活动描述
                    id: res[2],//活动id
                    hostAddress: res[3],//活动举办者链上id
                    hostName: hostName,//活动举办者名字
                    amount:res[5],//发行nft数量
                    nftName:nftRes[0],//nft名字
                    nftDes: nftRes[1],//nft描述
                    nftRest: nftRes[2]//该活动还剩余可被领取的nft数量
                });
            }
            
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
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
}

const noticeModel = {
    getNotice: async function(){
        const { getAmount } = noticeSolidity.methods;
        var amount = await getAmount().call();
        var result = [];
        if(amount > 0){
            const { getNotice } = noticeSolidity.methods;
            var returnRes = null;
            for(var i = 0;i < amount;i++){
                returnRes = await getNotice(i).call({});
                result.unshift({
                    id: i,
                    title: returnRes[0],
                    des: returnRes[1],
                    date: returnRes[2],
                    user: returnRes[3]
                })
            }
        }
        return new Promise((reslove, reject) => {
            reslove(result)
        })
    },
}

window.accountModel = accountModel;
window.nftModel = nftModel;
window.pageModel = pageModel;
window.activityModel = activityModel;
window.noticeModel = noticeModel;

window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取合约实例
    await init.getSolidityObject();
    
    //获取ipfs实例
    await init.getIpfs();
    
    //获取当前账号address
    await init.getAccount();
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