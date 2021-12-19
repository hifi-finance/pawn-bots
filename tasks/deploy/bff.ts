import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BotFarmFrens } from "../../src/types/BotFarmFrens";
import { BotFarmFrens__factory } from "../../src/types/factories/BotFarmFrens__factory";

task("deploy:BotFarmFrens")
  .addParam("currency", "Mint fee payment currency")
  .addParam("chainlinkToken", "Chainlink token address")
  .addParam("vrfCoordinator", "Chainlink VRF coordinator")
  .addParam("vrfFee", "Chainlink VRF fee")
  .addParam("vrfKeyHash", "Chainlink VRF key hash")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const bffFactory: BotFarmFrens__factory = <BotFarmFrens__factory>await ethers.getContractFactory("BotFarmFrens");
    const bff: BotFarmFrens = <BotFarmFrens>(
      await bffFactory.deploy(
        taskArguments.currency,
        taskArguments.chainlinkToken,
        taskArguments.vrfCoordinator,
        taskArguments.vrfFee,
        taskArguments.vrfKeyHash,
      )
    );
    await bff.deployed();
    console.log("BotFarmFrens deployed to: ", bff.address);
  });
