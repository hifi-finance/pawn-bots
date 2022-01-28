import { writeFileSync } from "fs";

import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { loadEntries } from "./helpers";

task("merkle:data")
  .setDescription("Generates a Merkle data file from a list of Ethereum accounts")
  .addParam("file", "CSV file containing all Ethereum accounts to generate Merkle data from")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const accounts = loadEntries(taskArguments.file)
      .map(ethers.utils.getAddress)
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
    const merkleLeaves: Buffer[] = accounts.map(keccak256);
    const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
    let data: { [account: string]: { proof: string } } = {};
    // TODO: split generated file into small light chunks
    for (const account of accounts) {
      const merkleProof: string[] = merkleTree.getHexProof(keccak256(account));
      data[account.toLowerCase()] = { proof: merkleProof.toString() };
    }

    writeFileSync("merkle-data.json", JSON.stringify(data));
    console.log("Generated Merkle data file: merkle-data.json");
  });
