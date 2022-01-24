import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("accounts")
  .setDescription("Prints the list of accounts")
  .addOptionalParam("index", "Index of account to print")
  .setAction(async (taskArguments: TaskArguments, { ethers }) => {
    const accounts: Signer[] = await ethers.getSigners();

    if (taskArguments.index !== undefined) {
      console.log(await accounts[taskArguments.index].getAddress());
    } else {
      for (const account of accounts) {
        console.log(await account.getAddress());
      }
    }
  });
