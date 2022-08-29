import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BurnTokenDistributor } from "../../src/types/BurnTokenDistributor";
import { BurnTokenDistributor__factory } from "../../src/types/factories/BurnTokenDistributor__factory";

task("deploy:BurnTokenDistributor").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const burnTokenDistributorFactory: BurnTokenDistributor__factory = <BurnTokenDistributor__factory>(
    await ethers.getContractFactory("BurnTokenDistributor")
  );
  const burnTokenDistributor: BurnTokenDistributor = <BurnTokenDistributor>await burnTokenDistributorFactory.deploy();
  await burnTokenDistributor.deployed();
  console.log("BurnTokenDistributor deployed to: ", burnTokenDistributor.address);
});
