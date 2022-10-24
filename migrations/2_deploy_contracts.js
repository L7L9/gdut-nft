const Factory = artifacts.require("Factory");
const Activity = artifacts.require("Activity");
const User = artifacts.require("User");

module.exports = function(deployer) {
  deployer.deploy(Factory);
  deployer.deploy(Activity);
  deployer.deploy(User);
};
