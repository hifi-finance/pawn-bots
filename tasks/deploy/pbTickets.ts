import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { PBTickets } from "../../src/types/PBTickets";
import { PBTickets__factory } from "../../src/types/factories/PBTickets__factory";

task("deploy:PBTickets")
  .addParam("merkleRoot", "Merkle root of private phase whitelist")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const pbTicketsFactory: PBTickets__factory = <PBTickets__factory>await ethers.getContractFactory("PBTickets");
    const pbTickets: PBTickets = <PBTickets>await pbTicketsFactory.deploy(taskArguments.merkleRoot);
    await pbTickets.deployed();
    console.log("PBTickets deployed to: ", pbTickets.address);
  });
