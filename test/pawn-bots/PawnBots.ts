import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import type { GodModePawnBots } from "../../src/types/GodModePawnBots";
import { IERC20 } from "../../src/types/IERC20";
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
      const linkToken: string = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
      const mftToken: string = "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428";
      const merkleLeaves: Buffer[] = allowlist.map(keccak256);
      const merkleTree: MerkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true, sortLeaves: true });
      const merkleRoot: string = merkleTree.getHexRoot();

      this.getMerkleProof = (address: string) => merkleTree.getHexProof(keccak256(address));

      const vrfCoordinator: string = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
      const vrfKeyHash: string = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445";

      const erc20Artifact: Artifact = await artifacts.readArtifact("IERC20");
      const pawnBotsArtifact: Artifact = await artifacts.readArtifact("GodModePawnBots");

      this.contracts.link = <IERC20>new ethers.Contract(linkToken, erc20Artifact.abi, this.signers.admin);
      this.contracts.mft = <IERC20>new ethers.Contract(mftToken, erc20Artifact.abi, this.signers.admin);
      this.contracts.pawnBots = <GodModePawnBots>(
        await waffle.deployContract(this.signers.admin, pawnBotsArtifact, [
          linkToken,
          vrfCoordinator,
          vrfFee,
          vrfKeyHash,
        ])
      );

      await this.contracts.pawnBots.setMerkleRoot(merkleRoot);
    });

    shouldBehaveLikePawnBots();
  });
});
