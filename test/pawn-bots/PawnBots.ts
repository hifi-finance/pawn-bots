import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { GodModePawnBots } from "../../src/types/GodModePawnBots";
import { Contracts, Signers } from "../types";
import { shouldBehaveLikePawnBots } from "./PawnBots.behavior";
import { vrfFee } from "../constants";
import { IERC20 } from "../../src/types/IERC20";
import { LinkTokenInterface } from "../../src/types/LinkTokenInterface";

describe("Tests", function () {
  before(async function () {
    this.contracts = {} as Contracts;
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
  });

  describe("PawnBots", async function () {
    beforeEach(async function () {
      const usdcToken: string = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
      const linkToken: string = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";
      const vrfCoordinator: string = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
      const vrfKeyHash: string = "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da";

      const pawnBotsArtifact: Artifact = await artifacts.readArtifact("GodModePawnBots");
      const erc20Artifact: Artifact = await artifacts.readArtifact("IERC20");
      const linkArtifact: Artifact = await artifacts.readArtifact("LinkTokenInterface");

      this.contracts.pawnBots = <GodModePawnBots>(
        await waffle.deployContract(this.signers.admin, pawnBotsArtifact, [
          usdcToken,
          linkToken,
          vrfCoordinator,
          vrfFee,
          vrfKeyHash,
        ])
      );
      this.contracts.link = <LinkTokenInterface>new ethers.Contract(linkToken, linkArtifact.abi, this.signers.admin);
      this.contracts.usdc = <IERC20>new ethers.Contract(usdcToken, erc20Artifact.abi, this.signers.admin);
    });

    shouldBehaveLikePawnBots();
  });
});
