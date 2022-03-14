import { expect } from "chai";
import { ethers, network } from "hardhat";

import { VRF_FEE } from "../constants";
import { timeContext } from "../contexts";
import { ImportedErrors, PawnBotsErrors } from "../errors";

export function shouldBehaveLikePawnBots(): void {
  describe("Deployment", function () {
    it("should contain the correct constants", async function () {
      expect(await this.contracts.pawnBots.COLLECTION_SIZE()).to.equal(10000);
      expect(await this.contracts.pawnBots.RESERVE_CAP()).to.equal(1000);
    });
  });

  describe("View Functions", function () {
    describe("claims", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          const { exists, allocatedAmount, claimedAmount } = await this.contracts.pawnBots.claims(
            this.signers.alice.address,
          );

          expect(exists).to.equal(false);
          expect(allocatedAmount).to.equal(0);
          expect(claimedAmount).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          this.claim = {
            exists: true,
            allocatedAmount: 10,
            claimedAmount: 7,
          };
          await this.contracts.pawnBots.__godMode_setClaim(this.signers.alice.address, this.claim);
        });

        it("returns the correct value", async function () {
          const { exists, allocatedAmount, claimedAmount } = await this.contracts.pawnBots.claims(
            this.signers.alice.address,
          );

          expect(exists).to.equal(this.claim.exists);
          expect(allocatedAmount).to.equal(this.claim.allocatedAmount);
          expect(claimedAmount).to.equal(this.claim.claimedAmount);
        });
      });
    });

    describe("isMintEnabled", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.isMintEnabled()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setIsMintEnabled(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.isMintEnabled()).to.equal(true);
        });
      });
    });

    describe("name", function () {
      it("returns the correct token name", async function () {
        expect(await this.contracts.pawnBots.name()).to.equal("Pawn Bots");
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

    describe("reservedElements", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.reservedElements()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setReservedElements(1000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.reservedElements()).to.equal(1000);
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

    describe("symbol", function () {
      it("returns the correct token symbol", async function () {
        expect(await this.contracts.pawnBots.symbol()).to.equal("BOTS");
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
          await this.contracts.pawnBots.__godMode_mint(1);
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
              expect(await this.contracts.pawnBots.tokenURI(0)).to.be.equal(this.baseURI + "box.json");
            });
          });

          context("when offset is changed", function () {
            beforeEach(async function () {
              await this.contracts.pawnBots.__godMode_setOffset(4856);
            });

            it("returns the correct value", async function () {
              expect(await this.contracts.pawnBots.tokenURI(0)).to.be.equal(this.baseURI + "4856.json");
            });
          });
        });
      });
    });
  });

  describe("Effects Functions", function () {
    describe("disableMint", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).disableMint()).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when mint is disabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setIsMintEnabled(false);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.disableMint()).to.be.revertedWith(PawnBotsErrors.MINT_IS_NOT_ENABLED);
          });
        });

        context("when mint is enabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setIsMintEnabled(true);
          });

          it("succeeds", async function () {
            const contractCall = await this.contracts.pawnBots.disableMint();
            expect(contractCall).to.emit(this.contracts.pawnBots, "DisableMint");
            expect(await this.contracts.pawnBots.isMintEnabled()).to.be.equal(false);
          });
        });
      });
    });

    describe("enableMint", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).enableMint()).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when mint is enabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setIsMintEnabled(true);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.enableMint()).to.be.revertedWith(
              PawnBotsErrors.MINT_IS_ALREADY_ENABLED,
            );
          });
        });

        context("when mint is disabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setIsMintEnabled(false);
          });

          it("succeeds", async function () {
            const contractCall = await this.contracts.pawnBots.enableMint();
            expect(contractCall).to.emit(this.contracts.pawnBots, "EnableMint");
            expect(await this.contracts.pawnBots.isMintEnabled()).to.be.equal(true);
          });
        });
      });
    });

    describe("mint", function () {
      context("when minting is not enabled", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).mint(0)).to.be.revertedWith(
            PawnBotsErrors.MINT_IS_NOT_ENABLED,
          );
        });
      });

      context("when minting is enabled", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setIsMintEnabled(true);
          await this.contracts.pawnBots.__godMode_mint(10);
        });

        context("when `mintAmount` overflows collection size`", function () {
          beforeEach(async function () {
            this.mintAmount = (await this.contracts.pawnBots.COLLECTION_SIZE())
              .sub(await this.contracts.pawnBots.RESERVE_CAP())
              .sub(await this.contracts.pawnBots.totalSupply())
              .add(1);
          });

          it("reverts", async function () {
            const signer = this.signers.alice;
            await expect(this.contracts.pawnBots.connect(signer).mint(this.mintAmount)).to.be.revertedWith(
              PawnBotsErrors.COLLECTION_SIZE_EXCEEDED,
            );
          });
        });

        context("when `mintAmount` does not overflow collection size", function () {
          context("when caller does not have a claim to mint", function () {
            it("reverts", async function () {
              const signer = this.signers.alice;
              await expect(this.contracts.pawnBots.connect(signer).mint(0)).to.be.revertedWith(
                PawnBotsErrors.USER_IS_NOT_ELIGIBLE,
              );
            });
          });

          context("when caller has a claim to mint", function () {
            beforeEach(async function () {
              this.claim = {
                exists: true,
                allocatedAmount: 10,
                claimedAmount: 0,
              };
              await this.contracts.pawnBots.__godMode_setClaim(this.signers.alice.address, this.claim);
            });

            context("when caller exceeds allocated amount", function () {
              it("reverts", async function () {
                const signer = this.signers.alice;
                await expect(
                  this.contracts.pawnBots.connect(signer).mint(this.claim.allocatedAmount + 1),
                ).to.be.revertedWith(PawnBotsErrors.USER_ELIGIBILITY_EXCEEDED);
              });
            });

            context("when caller does not exceed allocated amount", function () {
              it("succeeds", async function () {
                const signer = this.signers.alice;
                const contractCall = await this.contracts.pawnBots.connect(signer).mint(this.claim.allocatedAmount);
                expect(contractCall)
                  .to.emit(this.contracts.pawnBots, "Mint")
                  .withArgs(signer.address, this.claim.allocatedAmount);
                expect(await this.contracts.pawnBots.balanceOf(signer.address)).to.be.equal(this.claim.allocatedAmount);
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
          await expect(this.contracts.pawnBots.connect(signer).reserve(0)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when `reserveAmount` exceeds reserve cap minus `reservedElements`", function () {
          beforeEach(async function () {
            const reservedElements = 10;
            await this.contracts.pawnBots.__godMode_setReservedElements(reservedElements);
            this.reserveAmount = (await this.contracts.pawnBots.RESERVE_CAP())
              .sub(await this.contracts.pawnBots.reservedElements())
              .add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.reserve(this.reserveAmount)).to.be.revertedWith(
              PawnBotsErrors.RESERVE_CAP_EXCEEDED,
            );
          });
        });

        context("when `reserveAmount` does not exceed reserve cap minus `reservedElements`", function () {
          it("succeeds", async function () {
            const reserveAmount = 10;
            const contractCall = await this.contracts.pawnBots.reserve(reserveAmount);
            expect(contractCall).to.emit(this.contracts.pawnBots, "Reserve").withArgs(reserveAmount);
            expect(await this.contracts.pawnBots.balanceOf(this.signers.admin.address)).to.be.equal(reserveAmount);
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
          const linkTeam = "0x6f61507F902e1c22BCd7aa2C0452cd2212009B61";
          const signer = await ethers.getSigner(linkTeam);
          await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [linkTeam],
          });
          await this.contracts.link.connect(signer).transfer(this.contracts.pawnBots.address, VRF_FEE);
          await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [linkTeam],
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
                    expect(contractCall).to.emit(this.contracts.pawnBots, "Reveal");
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
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetBaseURI").withArgs(baseURI);
          expect(await this.contracts.pawnBots.__godMode_returnBaseURI()).to.be.equal(baseURI);
        });
      });
    });

    describe("setClaims", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setClaims([])).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when claim list provided is empty", function () {
          it("succeeds", async function () {
            const contractCall = await this.contracts.pawnBots.setClaims([]);
            expect(contractCall).to.emit(this.contracts.pawnBots, "SetClaims");
          });
        });

        context("when only one claim is given", function () {
          context("when given claim is new", function () {
            beforeEach(async function () {
              this.claim = {
                user: this.signers.alice.address,
                allocatedAmount: 10,
              };
            });

            it("succeeds", async function () {
              const contractCall = await this.contracts.pawnBots.setClaims([this.claim]);
              expect(contractCall).to.emit(this.contracts.pawnBots, "SetClaims");
              const claim = await this.contracts.pawnBots.claims(this.claim.user);
              expect(claim.allocatedAmount).to.be.equal(this.claim.allocatedAmount);
              expect(claim.claimedAmount).to.be.equal(0);
            });
          });

          context("when given claim already exists", function () {
            beforeEach(async function () {
              this.claim = {
                user: this.signers.alice.address,
                exists: true,
                claimedAmount: 5,
                allocatedAmount: 10,
              };
              this.newClaim = {
                user: this.signers.alice.address,
                allocatedAmount: 12,
              };
              await this.contracts.pawnBots.__godMode_setClaim(this.claim.user, this.claim);
            });

            it("succeeds", async function () {
              const contractCall = await this.contracts.pawnBots.setClaims([this.newClaim]);
              expect(contractCall).to.emit(this.contracts.pawnBots, "SetClaims");
              const claim = await this.contracts.pawnBots.claims(this.claim.user);
              expect(claim.allocatedAmount).to.be.equal(this.newClaim.allocatedAmount);
              expect(claim.claimedAmount).to.be.equal(this.claim.claimedAmount);
            });
          });
        });

        context("when more than one claim is given", function () {
          beforeEach(async function () {
            this.claims = [
              {
                user: this.signers.alice.address,
                allocatedAmount: 10,
              },
              {
                user: this.signers.bob.address,
                allocatedAmount: 3,
              },
              {
                user: this.signers.carol.address,
                allocatedAmount: 5,
              },
            ];
          });

          it("succeeds", async function () {
            const contractCall = await this.contracts.pawnBots.setClaims(this.claims);
            expect(contractCall).to.emit(this.contracts.pawnBots, "SetClaims");
            for (let i = 0; i < this.claims.length; i++) {
              const claim = await this.contracts.pawnBots.claims(this.claims[i].user);
              expect(claim.claimedAmount).to.be.equal(0);
              expect(claim.allocatedAmount).to.be.equal(this.claims[i].allocatedAmount);
            }
          });
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
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetProvenanceHash").withArgs(provenanceHash);
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
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetRevealTime").withArgs(revealTime);
          expect(await this.contracts.pawnBots.revealTime()).to.be.equal(revealTime);
        });
      });
    });
  });
}
