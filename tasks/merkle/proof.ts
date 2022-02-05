import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { loadEntries } from "./helpers";

task("merkle:proof")
  .setDescription("Return a Merkle proof for a given Ethereum account")
  .addParam("file", "CSV file containing all Ethereum accounts to construct Merkle tree from")
  .addParam("account", "Ethereum account to get Merkle proof for")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const merkleLeaves: Buffer[] = loadEntries(taskArguments.file).map(e => keccak256(ethers.utils.getAddress(e)));
    const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
    const merkleProof: string = merkleTree
      .getHexProof(keccak256(ethers.utils.getAddress(taskArguments.account)))
      .toString();

    console.log(merkleProof);
  });
