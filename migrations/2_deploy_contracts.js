const Factory = artifacts.require("Factory");
const Activity = artifacts.require("Activity");
const User = artifacts.require("User");
const Notice = artifacts.require("Notice");

module.exports = function(deployer) {
  deployer.deploy(Factory);
  deployer.deploy(Activity);
  deployer.deploy(User);
  deployer.deploy(Notice);
};
