import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { PawnBots } from "../../src/types/PawnBots";
import { PawnBots__factory } from "../../src/types/factories/PawnBots__factory";

task("deploy:PawnBots")
  .addParam("chainlinkToken", "Chainlink token address")
  .addParam("merkleRoot", "Merkle root hash of private phase allow list")
  .addParam("vrfCoordinator", "Chainlink VRF coordinator")
  .addParam("vrfFee", "Chainlink VRF fee")
  .addParam("vrfKeyHash", "Chainlink VRF key hash")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const pawnBotsFactory: PawnBots__factory = <PawnBots__factory>await ethers.getContractFactory("PawnBots");
    const pawnBots: PawnBots = <PawnBots>(
      await pawnBotsFactory.deploy(
        taskArguments.chainlinkToken,
        taskArguments.merkleRoot,
        taskArguments.vrfCoordinator,
        taskArguments.vrfFee,
        taskArguments.vrfKeyHash,
      )
    );
    await pawnBots.deployed();
    console.log("PawnBots deployed to: ", pawnBots.address);
  });
