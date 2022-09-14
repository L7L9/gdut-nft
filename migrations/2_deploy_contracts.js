const Factory = artifacts.require("Factory");
const Activity = artifacts.require("Activity");

module.exports = function(deployer) {
  deployer.deploy(Factory);
  deployer.deploy(Activity);
};
