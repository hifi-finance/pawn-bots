import { ethers, network } from "hardhat";

export function timeContext(description: string, timeToSkip: number, hooks: () => void): void {
  describe(description, function () {
    beforeEach(async function () {
      const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
      this.snapshot = await network.provider.send("evm_snapshot");
      await network.provider.send("evm_setNextBlockTimestamp", [currentTime + timeToSkip]);
    });

    afterEach(async function () {
      await network.provider.send("evm_revert", [this.snapshot]);
    });

    hooks();
  });
}
