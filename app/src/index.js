import Web3 from "web3";
var ipfsAPI = require('ipfs-api');
import factoryArtifact from "../../build/contracts/Factory.json";

//web3实例
var web3 = null;
//factory合约实例
var factory = null;
//ipfs实例
var ipfs = null;

const init = {
    getFactory: async function(){
        const networkId = await new web3.eth.net.getId();
        factory = new web3.eth.Contract(
            factoryArtifact.abi,
            factoryArtifact.networks[networkId].address
        );
    },

    getIpfs: async function(){
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
}

const accountModel = {
    account: null,

    login: async function(){
        var tempAccount = document.getElementById("account").value;
        var password = document.getElementById("password").value;

        web3.eth.personal.unlockAccount(tempAccount,password,10).then((res) =>{
            if(res == true){
                this.account = tempAccount;
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
        })
    },

    logout: async function(){
        this.account = null;
        window.location.replace("http://localhost:8081/index.html");
    }
}

const nftModel = {
    create: async function(){
        var file = document.querySelector("#nft").files;
        var name = document.getElementById("nftName").value;
        var img;
        //暂时没用
        var message = document.getElementById("nftMessage").value;
        
        //将文件存入ipfs中并获取cid
        console.log(file[0]);
        var reader = new FileReader();
        reader.readAsArrayBuffer(file[0]);
        reader.onloadend=async function(){
            console.log(reader.result);
            var img=Buffer.from(reader.result);
            console.log("前："+img);
            var cids=await ipfs.add(img);
            var cid=cids[0].hash;
            console.log(cid);
            //测试查看图片
            var buffer=null;
            await ipfs.get(cid,function (err,files) {
                console.log("后："+files[0].content);
                buffer=files[0].content;
                var url = window.URL.createObjectURL(new Blob([buffer]));
                var img = document.createElement('img')
                img.src = url;
                document.getElementById('nftShower').appendChild(img);
            })
        }
        //计算tokenId


        // //调用合约的铸造方法
        // const { mint } = factory.methods;
        // await mint().send({
        //     from: this.accountModel.account,
        //     gas: 1000000
        // }).then(() =>{
            
        // })
    },
}

function getBase64Image(img){
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }

window.accountModel = accountModel;
window.nftModel = nftModel;
window.onload = async function(){
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );
    
    //获取factory合约实例
    init.getFactory();
    
    //获取ipfs实例
    init.getIpfs();
}

// const App = {
//   web3: null,
//   account: null,
//   meta: null,

//   start: async function() {
//     const { web3 } = this;

//     try {
//       // get contract instance
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = metaCoinArtifact.networks[networkId];
//       this.meta = new web3.eth.Contract(
//         metaCoinArtifact.abi,
//         deployedNetwork.address,
//       );

//       // get accounts
//       const accounts = await web3.eth.getAccounts();
//       this.account = accounts[0];

//       this.refreshBalance();
//     } catch (error) {
//       console.error("Could not connect to contract or chain.");
//     }
//   },

//   refreshBalance: async function() {
//     const { getBalance } = this.meta.methods;
//     const balance = await getBalance(this.account).call();

//     const balanceElement = document.getElementsByClassName("balance")[0];
//     balanceElement.innerHTML = balance;
//   },

//   sendCoin: async function() {
//     const amount = parseInt(document.getElementById("amount").value);
//     const receiver = document.getElementById("receiver").value;

//     this.setStatus("Initiating transaction... (please wait)");

//     const { sendCoin } = this.meta.methods;
//     await sendCoin(receiver, amount).send({ from: this.account });

//     this.setStatus("Transaction complete!");
//     this.refreshBalance();
//   },

//   setStatus: function(message) {
//     const status = document.getElementById("status");
//     status.innerHTML = message;
//   },
// };

// window.App = App;

// window.addEventListener("load", function() {
//   if (window.ethereum) {
//     // use MetaMask's provider
//     App.web3 = new Web3(window.ethereum);
//     window.ethereum.enable(); // get permission to access accounts
//   } else {
//     console.warn(
//       "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
//     );
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//     App.web3 = new Web3(
//       new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
//     );
//   }

//   App.start();
// });