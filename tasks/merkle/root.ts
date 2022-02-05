import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { loadEntries } from "./helpers";

task("merkle:root")
  .setDescription("Generates a merkle root from a list of Ethereum accounts")
  .addParam("file", "CSV file containing the Ethereum accounts to construct Merkle tree from")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const accounts = loadEntries(taskArguments.file).map(ethers.utils.getAddress);
    const merkleLeaves: Buffer[] = accounts.map(keccak256);
    const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
    for (const account of accounts) {
      const merkleProof: string[] = merkleTree.getHexProof(keccak256(account));
      if (merkleProof.length == 0) {
        throw Error("Proof doesn't exist for account: " + account + ".");
      }
    }
    const merkleRoot: string = merkleTree.getHexRoot();

    console.log(merkleRoot);
  });
