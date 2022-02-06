import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import claims from "../../claims.json";
import { PawnBots } from "../../src/types/PawnBots";
import { PawnBots__factory } from "../../src/types/factories/PawnBots__factory";

task("claims:set")
  .setDescription("Set user mint claims according to an input JSON file")
  .addParam("file", "JSON file containing all user accounts and their allocated claim amounts to be set")
  .addParam("pawnBots", "Deployed Pawn Bots contract address")
  .addParam("chunkSize", "Used for splitting the input claims array into smaller chunks")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signer: SignerWithAddress = (await ethers.getSigners())[0];
    const pawnBotsFactory: PawnBots__factory = new PawnBots__factory(signer);
    const pawnBots: PawnBots = <PawnBots>pawnBotsFactory.attach(taskArguments.pawnBots);
    const chunkSize = Number(taskArguments.chunkSize);
    for (let i = 0; i < claims.length; i += chunkSize) {
      const chunk = claims.slice(i, i + chunkSize);
      await pawnBots.setClaims(chunk);
      console.log("Set " + chunk.length + " mint claims.");
    }

    console.log("Done.");
  });
