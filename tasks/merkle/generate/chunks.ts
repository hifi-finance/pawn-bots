import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { loadEntries } from "../helpers";

task("merkle:generate:chunks")
  .setDescription("Generates Merkle data chunk files from a provided list of Ethereum accounts")
  .addParam("file", "CSV file containing the Ethereum accounts to construct Merkle tree from")
  .addParam("chunkSize", "How many data entries at most should each chunk file contain")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const accounts = loadEntries(taskArguments.file)
      .map(ethers.utils.getAddress)
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));
    const merkleLeaves: Buffer[] = accounts.map(keccak256);
    const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
    const data: { [account: string]: { proof: string } } = {};
    for (const account of accounts) {
      const merkleProof: string[] = merkleTree.getHexProof(keccak256(account));
      data[account.toLowerCase()] = { proof: merkleProof.toString() };
    }
    const chunkIds: string[] = [];
    const chunkSize = Number(taskArguments.chunkSize);
    const dir = "merkle_chunks/";
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
    mkdirSync(dir);
    for (let i = 0; i < accounts.length; i += chunkSize) {
      const i_end = Math.min(i + chunkSize - 1, accounts.length - 1);
      const chunkId = accounts[i_end].toLowerCase();
      chunkIds.push(chunkId);
      const chunkFile = dir + chunkId + ".json";
      writeFileSync(
        chunkFile,
        JSON.stringify(
          accounts
            .slice(i, i_end + 1)
            .reduce(
              (chunk, account) => ((chunk[account.toLowerCase()] = data[account.toLowerCase()]), chunk),
              <{ [account: string]: { proof: string } }>{},
            ),
        ),
      );
      console.log("Generated Merkle data chunk file: " + chunkFile);
    }
  });
