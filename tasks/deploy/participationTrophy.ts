import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { ParticipationTrophy } from "../../src/types/ParticipationTrophy";
import { ParticipationTrophy__factory } from "../../src/types/factories/ParticipationTrophy__factory";

task("deploy:ParticipationTrophy")
  .addParam("uri", "Token URI")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const participationTrophyFactory: ParticipationTrophy__factory = <ParticipationTrophy__factory>(
      await ethers.getContractFactory("ParticipationTrophy")
    );
    const participationTrophy: ParticipationTrophy = <ParticipationTrophy>(
      await participationTrophyFactory.deploy(taskArguments.uri)
    );
    await participationTrophy.deployed();
    console.log("ParticipationTrophy deployed to: ", participationTrophy.address);
  });
