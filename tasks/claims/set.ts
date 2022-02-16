import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import claims from "../../claims.json";
import { PawnBots } from "../../src/types/PawnBots";
import { PawnBots__factory } from "../../src/types/factories/PawnBots__factory";

task("claims:set")
  .setDescription("Set user mint claims for Pawn Bots")
  .addParam("file", "JSON file containing all user accounts and their allocated claim amounts to be set")
  .addParam("pawnBots", "Deployed Pawn Bots contract address")
  .addParam("inputSize", "Used for splitting the input claims array to fit into the block size limitations")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const pawnBotsFactory: PawnBots__factory = new PawnBots__factory(signer);
    const pawnBots: PawnBots = <PawnBots>pawnBotsFactory.attach(taskArguments.pawnBots);
    const inputSize = Number(taskArguments.inputSize);
    console.log("Setting " + claims.length + " mint claims..");
    for (let i = 0; i < claims.length; i += inputSize) {
      const input = claims.slice(i, i + inputSize);
      const tx = await pawnBots.setClaims(input);
      await tx.wait(1);
    }
    console.log("Done.");
  });
