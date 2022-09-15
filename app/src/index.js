import Web3 from "web3";
const ipfsAPI = require('ipfs-api');
import factoryArtifact from "../../build/contracts/Factory.json";
import activityArtifact from "../../build/contracts/Activity.json";

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

const init = {
    getAccount: async function(){
        account = localStorage.getItem("account");
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
    login: async function(){
        var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.unlockAccount(tempAccount,password,10).then((res) =>{
            if(res == true){
                // sessionStorage.setItem("account",tempAccount);
                localStorage.setItem("account",tempAccount);
                account = tempAccount;
                alert("登陆成功");
                //跳转到登陆页面
                window.location.replace("http://localhost:8081/home.html");
            } else {
                alert("密码错误，请重新输入密码");
            }
        })
    },

    register: async function(){
        // var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.newAccount(password).then(function(res){
            prompt("注册成功，请记住账号密码\n你的账号：",res);

            // //转入以太以便使用
            // const accounts = await web3.eth.getAccounts();
            // var defaultAccount = accounts[0];
            // var _transfer = {
            //     from:defaultAccount,
            //     to:res,
            //     value: web3.utils.toWei('5','ether')
            // };

            // await web3.eth.sendTransaction(_transfer);
        })
    },

    logout: async function(){
        account = null;
        localStorage.removeItem("account");
        window.location.replace("http://localhost:8081/index.html");
    }
}

const nftModel = {
    create: async function(){
        var file = document.querySelector("#nft").files;
        var name = document.getElementById("nftName").value;
        //暂时没用
        var message = document.getElementById("nftMessage").value;
        
        //将文件存入ipfs中并获取cid
        var cid = null;
        var tokenId = null;
        // console.log(file[0]);
        var reader = new FileReader();
        reader.readAsArrayBuffer(file[0]);
        reader.onloadend = async function(){
            // console.log(reader.result);
            var img = Buffer.from(reader.result);
            // console.log("前："+img);
            var cids = await ipfs.add(img);

            cid = cids[0].hash;
            // console.log("cid:" + cid);
            
            tokenId = web3.utils.sha3(cid);
        }
        var account = localStorage.getItem("account");

        //转入以太以便使用
        const accounts = await web3.eth.getAccounts();
        var defaultAccount = accounts[0];
        var _transfer = {
            from:defaultAccount,
            to:account,
            value: web3.utils.toWei('5','ether')
        };

        await web3.eth.sendTransaction(_transfer);
        //调用合约的铸造方法
        const { mint } = factory.methods;
        await mint(tokenId,name,cid,message,0).send({
            from: account,
            gas: 1000000
        }).then((res) =>{
            console.log(res);
        })
    },

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
        
    }
}

const activityModel = {
    initiateActivity: async function(){
        const { initiate } = activity.methods;

        //活动名字
        var name = document.getElementById("").value;
        //活动描述
        var message = document.getElementById("").value;
        //nft奖品数量
        var amount = document.getElementById("").value;
        //活动nft的cid
        var cid = null;
        //领取nft的密钥
        var password = null;

        //创建nft
        nftModel.createForActivity().then(res=>{
            cid = res;
        })

        await initiate(name,message,amount,cid,password).send({
            from:account,
            gas:1000000
        }).then(res=>{
            console.log(res);
            alert("创建活动成功");
            //刷新活动页面
        })
    },
}

const pageModel = {
    showNumber: 4,

    showMyNFT: async function(){
        const { getPersonalNFT } = factory.methods;
        const { balanceOf } = factory.methods;

        //获取个人拥有的nft数量
        var amount = await balanceOf(account).call();
        //计算出最大页数
        var maxPage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));
        // console.log(maxPage);
        //获取页面的当前页数
        var page = document.getElementById("page").innerText;
        
        //实际展示数量
        var trueNum = this.showNumber * page;
        if(page == maxPage && (amount % this.showNumber) != 0 ){
            trueNum = (page - 1) * this.showNumber + amount % this.showNumber;
            for(let i = amount % this.showNumber; i < this.showNumber;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }

        //用于接受文件内容
        var content = null;
        //用于获取ipfs中的cid
        var cid = null;
        //用于获取url
        var url = null;
        //用于记录第几个的临时变量
        var num = 0;
        if(amount > 0){
            for(let i = (page-1) * this.showNumber;i < trueNum;i++){
                await getPersonalNFT(i).call({from:account}).then((res)=>{
                    //将res中数据渲染到前端
                    //获取图片信息
                    //res: 0=>tokenId  1=>cid  2=>name 3=>author 4=>description
                    // console.log(res);
                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]));
                        var img = document.getElementById("num"+num);
                        img.src = url;
                        document.getElementById("id"+num).innerText="tokenId："+web3.utils.toHex(res[0]);
                        document.getElementById("name"+num).innerText="nft名称："+res[2];
                        document.getElementById("description"+num).innerText="nft描述："+res[4];
                        num++;
                    })       
                })
            }
        } else {
            for(let i = 0;i < 4;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }
    },

    showAllNFT: async function(){
        const { getNFTAmount } = factory.methods;
        const { getCountAmount } = activity.methods;
        const { getActivityNFTAmount } = activity.methods;

        var numberForCountAmount = await getCountAmount().call();
        console.log("用于计算的数："+numberForCountAmount);
        //获取nft总量
        var tempAmount = await getNFTAmount().call();
        console.log("总量:" + tempAmount);
        //获取真实显示数量
        var amount = tempAmount - numberForCountAmount;
        console.log("真实数量:" + amount);
        //获取页面的当前页数
        var page = document.getElementById("page").innerText;
        
        var maxHomePage = (amount % this.showNumber == 0)?(amount / this.showNumber):(Math.ceil(amount / this.showNumber));
        console.log("maxPage:"+maxHomePage);
        //获取查询信息的方法
        const { getProperty } = factory.methods;
        
        //实际展示数量
        var trueNum = this.showNumber;
        if(page == maxHomePage && (amount % this.showNumber) != 0 ){
            trueNum = amount % this.showNumber;
            for(let i = amount % this.showNumber; i < this.showNumber;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
            for(let i = 0;i<trueNum;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="block";
            }
        }
        console.log("展示数量: "+ trueNum);

        if(amount > 0){
            //用于接受文件内容
            var content = null;
            //用于获取ipfs中的cid
            var cid = null;
            //用于获取url
            var url = null;
            //用于记录第几个的临时变量
            var num = 0;
            //nft的id
            var id = (page-1) * this.showNumber;

            var tempNum = null;
            while(num < trueNum){
                tempNum = num;
                await getProperty(id).call().then(res=>{
                    //将res中数据渲染到前端
                    //获取图片信息
                    //res: 0=>tokenId  1=>cid  2=>name 3=>author 4=>description 5=> activityId(nft是否为活动发放)
                    cid = res[1];
                    ipfs.get(cid,function(err,files){
                        if(err) throw err;
                        content = files[0].content;
                        url = window.URL.createObjectURL(new Blob([content]));
                        var img = document.getElementById("num"+tempNum);
                        img.src = url;
                        document.getElementById("name"+tempNum).innerText = "name："+res[2];
                        document.getElementById("tokenId"+tempNum).innerText = "tokenId："+web3.utils.toHex(res[0]);
                        document.getElementById("author"+tempNum).innerText = "author："+res[3];
                        document.getElementById("description"+tempNum).innerText = "nft描述："+res[4];
                    });
                    var activityId = res[5];
                    if(activityId != 0){
                        var increment = getActivityNFTAmount(activityId).call();
                        id += increment;
                    } else {
                        id++;
                    }
                });
                num++;
            }
        } else {
            for(let i = 0;i < 4;i++){
                var nftShow = document.getElementById("nft"+i);
                nftShow.style.display="none";
            }
        }
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
    
    //获取factory合约实例
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
}