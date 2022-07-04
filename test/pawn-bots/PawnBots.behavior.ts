import { HashZero } from "@ethersproject/constants";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { MintPhase, vrfFee } from "../constants";
import { timeContext } from "../contexts";
import { ImportedErrors, PawnBotsErrors } from "../errors";

export function shouldBehaveLikePawnBots(): void {
  describe("Deployment", function () {
    it("should deploy with the correct values", async function () {
      const COLLECTION_SIZE = await this.contracts.pawnBots.COLLECTION_SIZE();
      const RESERVE_CAP = await this.contracts.pawnBots.RESERVE_CAP();

      expect(COLLECTION_SIZE).to.equal("8888");
      expect(RESERVE_CAP).to.equal("2100");

      expect(await this.contracts.pawnBots.name()).to.equal("Pawn Bots");
      expect(await this.contracts.pawnBots.mintCap()).to.equal(COLLECTION_SIZE.sub(RESERVE_CAP));
      expect(await this.contracts.pawnBots.symbol()).to.equal("BOTS");
    });
  });

  describe("View Functions", function () {
    describe("maxPerAccount", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPerAccount()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMaxPerAccount(20);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPerAccount()).to.equal(20);
        });
      });
    });

    describe("mintActive", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintActive()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintActive(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintActive()).to.equal(true);
        });
      });
    });

    describe("mintCap", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintCap()).to.equal(6788);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintCap(8000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintCap()).to.equal(8000);
        });
      });
    });

    describe("minted", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.minted(this.signers.alice.address)).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMinted(this.signers.alice.address, 20);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.minted(this.signers.alice.address)).to.equal(20);
        });
      });
    });

    describe("mintPhase", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintPhase()).to.equal(MintPhase.PRIVATE);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintPhase(MintPhase.PUBLIC);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.mintPhase()).to.be.equal(MintPhase.PUBLIC);
        });
      });
    });

    describe("offset", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.offset()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setOffset(1479);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.offset()).to.equal(1479);
        });
      });
    });

    describe("provenanceHash", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.provenanceHash()).to.equal("");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setProvenanceHash(
            "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
          );
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.provenanceHash()).to.equal(
            "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
          );
        });
      });
    });

    describe("reserveMinted", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.reserveMinted()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setReserveMinted(1000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.reserveMinted()).to.equal(1000);
        });
      });
    });

    describe("revealTime", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.revealTime()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setRevealTime(1640641278);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.revealTime()).to.equal(1640641278);
        });
      });
    });

    describe("tokenURI", function () {
      context("when token does not exist", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.tokenURI(0)).to.be.revertedWith(PawnBotsErrors.NONEXISTENT_TOKEN);
        });
      });

      context("when token exists", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, 1);
        });

        context("when `baseURI` is not set", function () {
          it("returns the correct value", async function () {
            expect(await this.contracts.pawnBots.tokenURI(0)).to.be.equal("");
          });
        });

        context("when `baseURI` is set", function () {
          beforeEach(async function () {
            this.baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";
            await this.contracts.pawnBots.__godMode_setBaseURI(this.baseURI);
          });

          context("when offset not changed", function () {
            it("returns the correct value", async function () {
              expect(await this.contracts.pawnBots.tokenURI(0)).to.be.equal(this.baseURI + "box");
            });
          });

          context("when offset is changed", function () {
            beforeEach(async function () {
              await this.contracts.pawnBots.__godMode_setOffset("4856");
            });

            it("returns the correct value", async function () {
              expect(await this.contracts.pawnBots.tokenURI(0)).to.be.equal(this.baseURI + "0");
            });
          });
        });
      });
    });
  });

  describe("Effects Functions", function () {
    describe("burnUnsold", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).burnUnsold(0)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when mint is not paused", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintActive(true);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.burnUnsold(0)).to.be.revertedWith(PawnBotsErrors.MINT_NOT_PAUSED);
          });
        });

        context("when mint is paused", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintActive(false);
            await this.contracts.pawnBots.__godMode_setMintCap("300");
            await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, "900");
            await this.contracts.pawnBots.__godMode_setReserveMinted("700");
          });

          context("when `burnAmount` exceeds remaining mints", function () {
            beforeEach(async function () {
              this.burnAmount = "101";
            });

            it("reverts", async function () {
              await expect(this.contracts.pawnBots.burnUnsold(this.burnAmount)).to.be.revertedWith(
                PawnBotsErrors.REMAINING_MINTS_EXCEEDED,
              );
            });
          });

          context("when `burnAmount` does not exceed remaining mints", function () {
            beforeEach(async function () {
              this.burnAmount = "100";
            });

            it("succeeds", async function () {
              const contractCall0 = await this.contracts.pawnBots.burnUnsold(this.burnAmount);
              await expect(contractCall0).to.emit(this.contracts.pawnBots, "BurnUnsold").withArgs("100");
              expect(await this.contracts.pawnBots.mintCap()).to.be.equal("200");
            });
          });
        });
      });
    });

    describe("mintPrivate", function () {
      context("when mint is paused", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintActive(false);
        });

        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots
              .connect(this.signers.alice)
              .mintPrivate("0", this.getMerkleProof(this.signers.alice.address)),
          ).to.be.revertedWith(PawnBotsErrors.MINT_NOT_ACTIVE);
        });
      });

      context("when mint is active", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintActive(true);
        });

        context("when called while mint is set to public", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintPhase(MintPhase.PUBLIC);
          });

          it("reverts", async function () {
            await expect(
              this.contracts.pawnBots
                .connect(this.signers.alice)
                .mintPrivate("0", this.getMerkleProof(this.signers.alice.address)),
            ).to.be.revertedWith(PawnBotsErrors.MINT_PHASE_MISMATCH);
          });
        });

        context("when called while mint is set to private", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintPhase(MintPhase.PRIVATE);
          });

          context("when minter is not whitelisted", function () {
            it("reverts", async function () {
              await expect(
                this.contracts.pawnBots
                  .connect(this.signers.bob)
                  .mintPrivate("0", this.getMerkleProof(this.signers.bob.address)),
              ).to.be.revertedWith(PawnBotsErrors.ACCOUNT_NOT_ALLOWED);
            });
          });

          context("when minter is whitelisted", function () {
            context("when `mintAmount` exceeds minter's mint limit", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.__godMode_setMaxPerAccount("2");
                await this.contracts.pawnBots.__godMode_setMinted(this.signers.alice.address, "2");
              });

              it("reverts", async function () {
                await expect(
                  this.contracts.pawnBots
                    .connect(this.signers.alice)
                    .mintPrivate("1", this.getMerkleProof(this.signers.alice.address)),
                ).to.be.revertedWith(PawnBotsErrors.MAX_PER_ACCOUNT_EXCEEDED);
              });
            });

            context("when `mintAmount` does not exceed minter's mint limit", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.__godMode_setMaxPerAccount("2");
                await this.contracts.pawnBots.__godMode_setMinted(this.signers.alice.address, "0");
              });

              context("when `mintAmount` exceeds remaining mints", function () {
                beforeEach(async function () {
                  await this.contracts.pawnBots.__godMode_setMintCap("201");
                  await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, "900");
                  await this.contracts.pawnBots.__godMode_setReserveMinted("700");
                });

                it("reverts", async function () {
                  await expect(
                    this.contracts.pawnBots
                      .connect(this.signers.alice)
                      .mintPrivate("2", this.getMerkleProof(this.signers.alice.address)),
                  ).to.be.revertedWith(PawnBotsErrors.REMAINING_MINTS_EXCEEDED);
                });
              });

              context("when `mintAmount` does not exceed remaining mints", function () {
                beforeEach(async function () {
                  await this.contracts.pawnBots.__godMode_setMintCap("202");
                  await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, "900");
                  await this.contracts.pawnBots.__godMode_setReserveMinted("700");
                });

                context("when user does not have minimum MFT balance required", function () {
                  beforeEach(async function () {
                    // Send the MFT required fee to the user account
                    const whale = "0xa984Faa7a5Ff8Ee8182572d84Db12bc4B88983f7";
                    const signer = await ethers.getSigner(whale);
                    await network.provider.request({
                      method: "hardhat_impersonateAccount",
                      params: [whale],
                    });
                    await this.contracts.mft.connect(signer).transfer(this.signers.alice.address, "999999999999999999");
                    await network.provider.request({
                      method: "hardhat_stopImpersonatingAccount",
                      params: [whale],
                    });
                  });

                  it("reverts", async function () {
                    await expect(
                      this.contracts.pawnBots
                        .connect(this.signers.alice)
                        .mintPrivate("2", this.getMerkleProof(this.signers.alice.address)),
                    ).to.be.revertedWith(PawnBotsErrors.NOT_ENOUGH_MFT_BALANCE);
                  });
                });

                context("when user has minimum MFT balance required", function () {
                  beforeEach(async function () {
                    // Send the MFT required fee to the user account
                    const whale = "0xa984Faa7a5Ff8Ee8182572d84Db12bc4B88983f7";
                    const signer = await ethers.getSigner(whale);
                    await network.provider.request({
                      method: "hardhat_impersonateAccount",
                      params: [whale],
                    });
                    await this.contracts.mft
                      .connect(signer)
                      .transfer(this.signers.alice.address, "1000000000000000000");
                    await network.provider.request({
                      method: "hardhat_stopImpersonatingAccount",
                      params: [whale],
                    });
                  });

                  it("succeeds", async function () {
                    const contractCall = await this.contracts.pawnBots
                      .connect(this.signers.alice)
                      .mintPrivate("2", this.getMerkleProof(this.signers.alice.address));
                    await expect(contractCall)
                      .to.emit(this.contracts.pawnBots, "Mint")
                      .withArgs(this.signers.alice.address, "2", MintPhase.PRIVATE);
                    expect(await this.contracts.pawnBots.balanceOf(this.signers.alice.address)).to.be.equal("2");
                  });
                });
              });
            });
          });
        });
      });
    });

    describe("mintPublic", function () {
      context("when mint is paused", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintActive(false);
        });

        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).mintPublic("0")).to.be.revertedWith(
            PawnBotsErrors.MINT_NOT_ACTIVE,
          );
        });
      });

      context("when mint is active", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMintActive(true);
        });

        context("when called while mint is set to private", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintPhase(MintPhase.PRIVATE);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.connect(this.signers.alice).mintPublic("0")).to.be.revertedWith(
              PawnBotsErrors.MINT_PHASE_MISMATCH,
            );
          });
        });

        context("when called while mint is set to public", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setMintPhase(MintPhase.PUBLIC);
          });

          context("when `mintAmount` exceeds minter's mint limit", function () {
            beforeEach(async function () {
              await this.contracts.pawnBots.__godMode_setMaxPerAccount("2");
            });

            it("reverts", async function () {
              await expect(this.contracts.pawnBots.connect(this.signers.alice).mintPublic("3")).to.be.revertedWith(
                PawnBotsErrors.MAX_PER_ACCOUNT_EXCEEDED,
              );
            });
          });

          context("when `mintAmount` does not exceed minter's mint limit", function () {
            beforeEach(async function () {
              await this.contracts.pawnBots.__godMode_setMaxPerAccount("2");
            });

            context("when `mintAmount` exceeds remaining mints", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.__godMode_setMintCap("201");
                await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, "900");
                await this.contracts.pawnBots.__godMode_setReserveMinted("700");
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.connect(this.signers.alice).mintPublic("2")).to.be.revertedWith(
                  PawnBotsErrors.REMAINING_MINTS_EXCEEDED,
                );
              });
            });

            context("when `mintAmount` does not exceed remaining mints", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.__godMode_setMintCap("202");
                await this.contracts.pawnBots.__godMode_mint(this.signers.admin.address, "900");
                await this.contracts.pawnBots.__godMode_setReserveMinted("700");
              });

              context("when user does not have minimum MFT balance required", function () {
                beforeEach(async function () {
                  // Send the MFT required fee to the user account
                  const whale = "0xa984Faa7a5Ff8Ee8182572d84Db12bc4B88983f7";
                  const signer = await ethers.getSigner(whale);
                  await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [whale],
                  });
                  await this.contracts.mft.connect(signer).transfer(this.signers.alice.address, "999999999999999999");
                  await network.provider.request({
                    method: "hardhat_stopImpersonatingAccount",
                    params: [whale],
                  });
                });

                it("reverts", async function () {
                  await expect(this.contracts.pawnBots.connect(this.signers.bob).mintPublic("2")).to.be.revertedWith(
                    PawnBotsErrors.NOT_ENOUGH_MFT_BALANCE,
                  );
                });
              });

              context("when user has minimum MFT balance required", function () {
                beforeEach(async function () {
                  // Send the MFT required fee to the user account
                  const whale = "0xa984Faa7a5Ff8Ee8182572d84Db12bc4B88983f7";
                  const signer = await ethers.getSigner(whale);
                  await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [whale],
                  });
                  await this.contracts.mft.connect(signer).transfer(this.signers.bob.address, "1000000000000000000");
                  await network.provider.request({
                    method: "hardhat_stopImpersonatingAccount",
                    params: [whale],
                  });
                });

                it("succeeds", async function () {
                  const contractCall = await this.contracts.pawnBots.connect(this.signers.bob).mintPublic("2");
                  await expect(contractCall)
                    .to.emit(this.contracts.pawnBots, "Mint")
                    .withArgs(this.signers.bob.address, "2", MintPhase.PUBLIC);
                  expect(await this.contracts.pawnBots.balanceOf(this.signers.bob.address)).to.be.equal("2");
                });
              });
            });
          });
        });
      });
    });

    describe("reserve", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(
            this.contracts.pawnBots.connect(signer).reserve("0", this.signers.alice.address),
          ).to.be.revertedWith(ImportedErrors.CALLER_NOT_OWNER);
        });
      });

      context("when called by owner", function () {
        context("when `reserveAmount` exceeds remaining reserve", function () {
          beforeEach(async function () {
            const reserveMinted = 10;
            await this.contracts.pawnBots.__godMode_setReserveMinted(reserveMinted);
            this.reserveAmount = (await this.contracts.pawnBots.RESERVE_CAP())
              .sub(await this.contracts.pawnBots.reserveMinted())
              .add(1);
          });

          it("reverts", async function () {
            await expect(
              this.contracts.pawnBots.reserve(this.reserveAmount, this.signers.alice.address),
            ).to.be.revertedWith(PawnBotsErrors.REMAINING_RESERVE_EXCEEDED);
          });
        });

        context("when `reserveAmount` does not exceed remaining reserve", function () {
          beforeEach(async function () {
            const reserveMinted = 10;
            await this.contracts.pawnBots.__godMode_setReserveMinted(reserveMinted);
            this.reserveAmount = (await this.contracts.pawnBots.RESERVE_CAP()).sub(
              await this.contracts.pawnBots.reserveMinted(),
            );
          });

          it("succeeds", async function () {
            const reserveAmount = 10;
            const recipient = this.signers.alice.address;
            const contractCall = await this.contracts.pawnBots.reserve(reserveAmount, recipient);
            await expect(contractCall).to.emit(this.contracts.pawnBots, "Reserve").withArgs(reserveAmount, recipient);
            expect(await this.contracts.pawnBots.balanceOf(recipient)).to.be.equal(reserveAmount);
          });
        });
      });
    });

    describe("reveal", function () {
      context("when contract doesn't contain the VRF fee in its balance", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith("");
        });
      });

      context("when contract contains the VRF fee in its balance", function () {
        beforeEach(async function () {
          // Send the VRF fee to the contract
          const whale = "0xbe6977E08D4479C0A6777539Ae0e8fa27BE4e9d6";
          const signer = await ethers.getSigner(whale);
          await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [whale],
          });
          await this.contracts.link.connect(signer).transfer(this.contracts.pawnBots.address, vrfFee);
          await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [whale],
          });
        });

        context("when not called by owner", function () {
          it("reverts", async function () {
            const signer = this.signers.alice;
            await expect(this.contracts.pawnBots.connect(signer).reveal()).to.be.revertedWith(
              ImportedErrors.CALLER_NOT_OWNER,
            );
          });
        });

        context("when called by owner", function () {
          beforeEach(async function () {
            const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
            await this.contracts.pawnBots.__godMode_setRevealTime(currentTime + 2000000);
          });

          timeContext("when called too early", 1999998, function () {
            it("reverts", async function () {
              await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(PawnBotsErrors.TOO_EARLY_TO_REVEAL);
            });
          });

          timeContext("when called after `revealTime`", 2000001, function () {
            context("when called after offset is already set", function () {
              beforeEach(async function () {
                const offset = 1456;
                await this.contracts.pawnBots.__godMode_setOffset(offset);
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(PawnBotsErrors.OFFSET_ALREADY_SET);
              });
            });

            context("when offset has not yet been set", function () {
              context("when randomness is already requested", function () {
                beforeEach(async function () {
                  const requestId = "0x0000000000000000000000000000000000000000000000000000000000000001";
                  await this.contracts.pawnBots.__godMode_setVrfRequestId(requestId);
                });

                it("reverts", async function () {
                  await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(
                    PawnBotsErrors.RANDOMNESS_ALREADY_REQUESTED,
                  );
                });
              });

              context("when randomness has not been requested", function () {
                context("when vrf coordinator miraculously fails", function () {
                  context("when vrf coordinator tries to fullfill randomness more than once", function () {
                    it("reverts", async function () {
                      const randomNumber = 10450;
                      const initialRequestId = "0x0000000000000000000000000000000000000000000000000000000000000000";
                      await this.contracts.pawnBots.reveal();
                      const requestId = await this.contracts.pawnBots.__godMode_returnVrfRequestId();
                      expect(requestId).to.not.be.equal(initialRequestId);
                      await this.contracts.pawnBots.__godMode_fulfillRandomness(requestId, randomNumber);
                      await expect(
                        this.contracts.pawnBots.__godMode_fulfillRandomness(requestId, randomNumber),
                      ).to.be.revertedWith(PawnBotsErrors.OFFSET_ALREADY_SET);
                    });
                  });

                  context("when vrf coordinator returns randomness with different request id", function () {
                    it("reverts", async function () {
                      const randomNumber = 10450;
                      const initialRequestId = "0x0000000000000000000000000000000000000000000000000000000000000000";
                      await this.contracts.pawnBots.reveal();
                      const requestId = await this.contracts.pawnBots.__godMode_returnVrfRequestId();
                      expect(requestId).to.not.be.equal(initialRequestId);
                      await expect(
                        this.contracts.pawnBots.__godMode_fulfillRandomness(
                          "0x0000000000000000000000000000000000000000000000000000000000c0ffee",
                          randomNumber,
                        ),
                      ).to.be.revertedWith(PawnBotsErrors.VRF_REQUEST_ID_MISMATCH);
                    });
                  });
                });

                context("when vrf coordinator works as expected", function () {
                  it("succeeds", async function () {
                    const randomNumber = 10450;
                    const initialRequestId = "0x0000000000000000000000000000000000000000000000000000000000000000";
                    const collectionSize = Number(await this.contracts.pawnBots.COLLECTION_SIZE());
                    await this.contracts.pawnBots.reveal();
                    const requestId = await this.contracts.pawnBots.__godMode_returnVrfRequestId();
                    expect(requestId).to.not.be.equal(initialRequestId);
                    const contractCall = await this.contracts.pawnBots.__godMode_fulfillRandomness(
                      requestId,
                      randomNumber,
                    );
                    await expect(contractCall).to.emit(this.contracts.pawnBots, "Reveal");
                    expect(await this.contracts.pawnBots.offset()).to.be.equal(
                      (randomNumber % (collectionSize - 1)) + 1,
                    );
                  });
                });
              });
            });
          });
        });
      });
    });

    describe("setBaseURI", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setBaseURI("")).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";
          const contractCall = await this.contracts.pawnBots.setBaseURI(baseURI);
          await expect(contractCall).to.emit(this.contracts.pawnBots, "SetBaseURI").withArgs(baseURI);
          expect(await this.contracts.pawnBots.__godMode_returnBaseURI()).to.be.equal(baseURI);
        });
      });
    });

    describe("setMaxPerAccount", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setMaxPerAccount(0)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxPrivatePerAccount = 10;
          const contractCall = await this.contracts.pawnBots.setMaxPerAccount(maxPrivatePerAccount);
          await expect(contractCall)
            .to.emit(this.contracts.pawnBots, "SetMaxPerAccount")
            .withArgs(maxPrivatePerAccount);
          expect(await this.contracts.pawnBots.maxPerAccount()).to.be.equal(maxPrivatePerAccount);
        });
      });
    });

    describe("setMerkleRoot", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setMerkleRoot(HashZero)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const merkleRoot = "0xdffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";
          const contractCall = await this.contracts.pawnBots.setMerkleRoot(merkleRoot);
          await expect(contractCall).to.emit(this.contracts.pawnBots, "SetMerkleRoot").withArgs(merkleRoot);
          expect(await this.contracts.pawnBots.__godMode_returnMerkleRoot()).to.be.equal(merkleRoot);
        });
      });
    });

    describe("setProvenanceHash", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setProvenanceHash("")).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const provenanceHash = "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";
          const contractCall = await this.contracts.pawnBots.setProvenanceHash(provenanceHash);
          await expect(contractCall).to.emit(this.contracts.pawnBots, "SetProvenanceHash").withArgs(provenanceHash);
          expect(await this.contracts.pawnBots.provenanceHash()).to.be.equal(provenanceHash);
        });
      });
    });

    describe("setRevealTime", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setRevealTime(0)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const revealTime = 1640641278;
          const contractCall = await this.contracts.pawnBots.setRevealTime(revealTime);
          await expect(contractCall).to.emit(this.contracts.pawnBots, "SetRevealTime").withArgs(revealTime);
          expect(await this.contracts.pawnBots.revealTime()).to.be.equal(revealTime);
        });
      });
    });

    describe("setMintActive", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setMintActive(false)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const mintActive = true;
          const contractCall = await this.contracts.pawnBots.setMintActive(mintActive);
          await expect(contractCall).to.emit(this.contracts.pawnBots, "SetMintActive").withArgs(mintActive);
          expect(await this.contracts.pawnBots.mintActive()).to.be.equal(mintActive);
        });
      });
    });

    describe("setMintPhase", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots.connect(this.signers.alice).setMintPhase(MintPhase.PRIVATE),
          ).to.be.revertedWith(ImportedErrors.CALLER_NOT_OWNER);
        });
      });

      context("when called by owner", function () {
        context("when called by owner", function () {
          it("succeeds", async function () {
            const mintPhase = MintPhase.PUBLIC;
            const contractCall = await this.contracts.pawnBots.setMintPhase(mintPhase);
            await expect(contractCall).to.emit(this.contracts.pawnBots, "SetMintPhase").withArgs(mintPhase);
            expect(await this.contracts.pawnBots.mintPhase()).to.be.equal(mintPhase);
          });
        });
      });
    });
  });
}
