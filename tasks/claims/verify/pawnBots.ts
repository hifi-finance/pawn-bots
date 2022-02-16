import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { PawnBots } from "../../../src/types/PawnBots";
import { PawnBots__factory } from "../../../src/types/factories/PawnBots__factory";
import { readFileSync } from "fs";

task("claims:verify:pawnBots")
  .setDescription("Verify that user mint claims match the set Pawn Bots claims")
  .addParam("file", "JSON file containing all user accounts and their allocated claim amounts to be verified")
  .addParam("pawnBots", "Deployed Pawn Bots contract address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const claims: { user: string; allocatedAmount: number }[] = JSON.parse(readFileSync(taskArguments.file).toString());
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const pawnBotsFactory: PawnBots__factory = new PawnBots__factory(signer);
    const pawnBots: PawnBots = <PawnBots>pawnBotsFactory.attach(taskArguments.pawnBots);
    for (const claim of claims) {
      const { user, allocatedAmount: expectedAllocatedAmount } = claim;
      console.log("Verifying " + user + "..");
      const { exists, allocatedAmount, claimedAmount } = await pawnBots.claims(user);
      if (!exists) {
        throw Error("On-chain claim does not exist.");
      }
      if (Number(allocatedAmount) !== expectedAllocatedAmount) {
        throw Error("Allocated amount does not match on-chain claim.");
      }
      if (Number(claimedAmount) !== 0) {
        throw Error("On-chain claimed amount is greater than 0.");
      }
    }
    console.log("Done.");
  });
