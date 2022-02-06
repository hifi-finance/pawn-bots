import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import claims from "../../../claims.json";
import { PawnBots } from "../../../src/types/PawnBots";
import { PawnBots__factory } from "../../../src/types/factories/PawnBots__factory";

task("claims:verify:pawnBots")
  .setDescription("Set user mint claims according to an input JSON file")
  .addParam("file", "JSON file containing all user accounts and their allocated claim amounts to be verified")
  .addParam("pawnBots", "Deployed Pawn Bots contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const pawnBotsFactory: PawnBots__factory = new PawnBots__factory(signer);
    const pawnBots: PawnBots = <PawnBots>pawnBotsFactory.attach(taskArguments.pawnBots);
    for (const claim of claims) {
      const { user, allocatedAmount: expectedAllocatedAmount } = claim;
      const { exists, allocatedAmount, claimedAmount } = await pawnBots.claims(user);
      if (!exists) {
        throw Error("On-chain claim for " + user + " does not exist.");
      }
      if (Number(allocatedAmount) !== expectedAllocatedAmount) {
        throw Error("Allocated amount for " + user + " does not match on-chain claim.");
      }
      if (Number(claimedAmount) !== 0) {
        throw Error("On-chain claimed amount for " + user + " greater than 0.");
      }
      console.log("Verified " + user + ".");
    }

    console.log("Done.");
  });
