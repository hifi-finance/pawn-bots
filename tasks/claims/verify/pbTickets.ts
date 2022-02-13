import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import claims from "../../../claims.json";
import { PBTickets__factory } from "../../../src/types/factories/PBTickets__factory";
import { PBTickets } from "../../../src/types/PBTickets";

task("claims:verify:pbTickets")
  .setDescription("Set user mint claims according to an input JSON file")
  .addParam("file", "JSON file containing all user accounts and their allocated claim amounts to be verified")
  .addParam("pbTickets", "Deployed PBTickets contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const pbTicketsFactory: PBTickets__factory = new PBTickets__factory(signer);
    const pbTickets: PBTickets = <PBTickets>pbTicketsFactory.attach(taskArguments.pbTickets);
    if ((await pbTickets.paused()) !== true) {
      throw Error("PBTickets contract is not paused.");
    }
    for (const claim of claims) {
      const { user, allocatedAmount } = claim;
      if (allocatedAmount !== Number(await pbTickets.balanceOf(user))) {
        throw Error("Allocated amount for " + user + " does not match PBTKT balance.");
      }
      console.log("Verified " + user + ".");
    }
    if (claims.map(c => c.allocatedAmount).reduce((a, b) => a + b, 0) !== Number(await pbTickets.totalSupply())) {
      throw Error("Input claim count does not match with PBTKT total supply.");
    }

    console.log("Done.");
  });
