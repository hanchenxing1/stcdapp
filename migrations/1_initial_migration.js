const Migrations = artifacts.require("Migrations");
const EcoCity = artifacts.require("EcoCity");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(EcoCity);
}