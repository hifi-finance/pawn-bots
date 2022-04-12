import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import type { GodModePawnBots } from "../../src/types/GodModePawnBots";
import { LinkTokenInterface } from "../../src/types/LinkTokenInterface";
import { vrfFee } from "../constants";
import { Contracts, Signers } from "../types";
import { shouldBehaveLikePawnBots } from "./PawnBots.behavior";

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

  describe("PawnBots", async function () {
    beforeEach(async function () {
      const allowlist: string[] = [this.signers.alice.address, this.signers.carol.address, this.signers.eve.address];
      const linkToken: string = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";
      const merkleLeaves: Buffer[] = allowlist.map(keccak256);
      const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
      const merkleRoot: string = merkleTree.getHexRoot();

      this.getMerkleProof = (address: string) => merkleTree.getHexProof(keccak256(address));

      const vrfCoordinator: string = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
      const vrfKeyHash: string = "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da";

      const linkArtifact: Artifact = await artifacts.readArtifact("LinkTokenInterface");
      const pawnBotsArtifact: Artifact = await artifacts.readArtifact("GodModePawnBots");

      this.contracts.link = <LinkTokenInterface>new ethers.Contract(linkToken, linkArtifact.abi, this.signers.admin);
      this.contracts.pawnBots = <GodModePawnBots>(
        await waffle.deployContract(this.signers.admin, pawnBotsArtifact, [
          linkToken,
          merkleRoot,
          vrfCoordinator,
          vrfFee,
          vrfKeyHash,
        ])
      );
    });

    shouldBehaveLikePawnBots();
  });
});
