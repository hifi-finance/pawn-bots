import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import type { GodModePBTickets } from "../../src/types/GodModePBTickets";
import { Contracts, Signers } from "../types";
import { shouldBehaveLikePBTickets } from "./PBTickets.behavior";

describe("Tests", function () {
  before(async function () {
    this.contracts = {} as Contracts;
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
    this.signers.carol = signers[3];
    this.signers.dave = signers[4];
    this.signers.eve = signers[5];
  });

  describe("PBTickets", async function () {
    beforeEach(async function () {
      const whitelisted: string[] = [this.signers.alice.address, this.signers.carol.address, this.signers.eve.address];
      const merkleLeaves: Buffer[] = whitelisted.map(keccak256);
      const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
      const merkleRoot: string = merkleTree.getHexRoot();

      this.getMerkleProof = (address: string) => merkleTree.getHexProof(keccak256(address));

      const pbTicketsArtifact: Artifact = await artifacts.readArtifact("GodModePBTickets");

      this.contracts.pbTickets = <GodModePBTickets>(
        await waffle.deployContract(this.signers.admin, pbTicketsArtifact, [merkleRoot])
      );
    });

    shouldBehaveLikePBTickets();
  });
});
