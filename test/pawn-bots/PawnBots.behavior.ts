import { expect } from "chai";
import { ethers, network } from "hardhat";

import { VRF_FEE } from "../constants";
import { PawnBotsErrors } from "../errors";

export function shouldBehaveLikePawnBots(): void {
  describe("Deployment", function () {
    it("should contain the correct constants", async function () {
      expect(await this.contracts.pawnBots.COLLECTION_SIZE()).to.equal(10000);
      expect(await this.contracts.pawnBots.MAX_RESERVED_ELEMENTS()).to.equal(1000);
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
          expect(allocatedAmount).to.equal("0");
          expect(claimedAmount).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          this.claim = {
            exists: true,
            allocatedAmount: "10",
            claimedAmount: "7",
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
          expect(await this.contracts.pawnBots.offset()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setOffset("1479");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.offset()).to.equal("1479");
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
          expect(await this.contracts.pawnBots.revealTime()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setRevealTime("1640641278");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.revealTime()).to.equal("1640641278");
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
          await expect(this.contracts.pawnBots.tokenURI(0)).to.be.reverted;
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
          await expect(this.contracts.pawnBots.connect(this.signers.alice).disableMint()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when mint is disabled", function () {
          it("reverts", async function () {
            await expect(this.contracts.pawnBots.disableMint()).to.be.revertedWith(PawnBotsErrors.MINT_IS_NOT_ENABLED);
          });
        });

        context("when mint is enabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.enableMint();
          });

          it("succeeds", async function () {
            await this.contracts.pawnBots.disableMint();
            expect(await this.contracts.pawnBots.isMintEnabled()).to.be.equal(false);
          });
        });
      });
    });

    describe("enableMint", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).enableMint()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when mint is enabled", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.enableMint();
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.enableMint()).to.be.revertedWith(
              PawnBotsErrors.MINT_IS_ALREADY_ENABLED,
            );
          });
        });

        context("when mint is disabled", function () {
          it("succeeds", async function () {
            await this.contracts.pawnBots.enableMint();
            expect(await this.contracts.pawnBots.isMintEnabled()).to.be.equal(true);
          });
        });
      });
    });

    describe("mint", function () {
      context("when minting is not enabled", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).mint(0)).to.be.revertedWith(
            PawnBotsErrors.MINT_IS_NOT_ENABLED,
          );
        });
      });

      context("when minting is enabled", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.enableMint();
        });

        context("when `mintAmount` plus `totalSupply()` exceeds theoretical collection size", function () {
          beforeEach(async function () {
            this.mintAmount = (await this.contracts.pawnBots.COLLECTION_SIZE()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount)).to.be.revertedWith(
              PawnBotsErrors.COLLECTION_SIZE_EXCEEDED,
            );
          });
        });

        context("when `mintAmount` plus `totalSupply()` does not exceed theoretical collection size", function () {
          beforeEach(async function () {
            this.mintAmount = 10;
          });

          context("when caller does not have a claim to mint", function () {
            it("reverts", async function () {
              await expect(
                this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
              ).to.be.revertedWith(PawnBotsErrors.USER_IS_NOT_ELIGIBLE);
            });
          });

          context("when caller has a claim to mint", function () {
            beforeEach(async function () {
              const claim = { user: this.signers.alice.address, allocatedAmount: this.mintAmount };

              await this.contracts.pawnBots.setClaims([claim]);
            });

            it("succeeds", async function () {
              await this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount);
              expect(await this.contracts.pawnBots.balanceOf(this.signers.alice.address)).to.be.equal(this.mintAmount);
            });
          });
        });
      });
    });

    describe("reserve", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).reserve(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when `reserveAmount` exceeds max reserve limit minus `totalSupply()`", function () {
          beforeEach(async function () {
            this.reserveAmount = (await this.contracts.pawnBots.COLLECTION_SIZE()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.reserve(this.reserveAmount)).to.be.revertedWith(
              PawnBotsErrors.MAX_RESERVED_ELEMENTS_EXCEEDED,
            );
          });
        });

        context("when `reserveAmount` does not exceed max reserve limit minus `totalSupply()`", function () {
          context("when reserving in one call", function () {
            it("succeeds", async function () {
              const reservedElements = 1;

              await this.contracts.pawnBots.reserve(reservedElements);
              expect(await this.contracts.pawnBots.balanceOf(this.signers.admin.address)).to.be.equal(reservedElements);
            });
          });

          context("when reserving through multiple calls", function () {
            it("succeeds", async function () {
              const numberOfCalls = 10;
              const reservedElements = (await this.contracts.pawnBots.COLLECTION_SIZE()).div(100);

              for (let i = 0; i < numberOfCalls; i++) {
                await this.contracts.pawnBots.reserve(reservedElements);
              }
              expect(await this.contracts.pawnBots.balanceOf(this.signers.admin.address)).to.be.equal(
                reservedElements.mul(numberOfCalls),
              );
            });
          });
        });
      });
    });

    describe("reveal", function () {
      context("when contract doesn't contain the VRF fee in its balance", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.reveal()).to.be.reverted;
        });
      });

      context("when contract contains the VRF fee in its balance", function () {
        beforeEach(async function () {
          // Send the VRF fee to the contract
          const linkTeam = "0x6f61507F902e1c22BCd7aa2C0452cd2212009B61";
          await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [linkTeam],
          });
          const signer = await ethers.getSigner(linkTeam);
          await this.contracts.link.connect(signer).transfer(this.contracts.pawnBots.address, VRF_FEE);
          await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [linkTeam],
          });
        });

        context("when not called by owner", function () {
          it("reverts", async function () {
            await expect(this.contracts.pawnBots.connect(this.signers.alice).reveal()).to.be.reverted;
          });
        });

        context("when called by owner", function () {
          context("when called again after the first time", function () {
            context("when offset is already set", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.reveal();
                await this.contracts.pawnBots.__godMode_setOffset("1456");
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(PawnBotsErrors.OFFSET_ALREADY_SET);
              });
            });

            context("when offset is not yet set", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.reveal();
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(
                  PawnBotsErrors.RANDOMNESS_ALREADY_REQUESTED,
                );
              });
            });
          });

          context("when called for the first time", function () {
            it("succeeds", async function () {
              const randomNumber = 10450;
              const initialRequestId = "0x0000000000000000000000000000000000000000000000000000000000000000";

              await this.contracts.pawnBots.reveal();
              const requestId = await this.contracts.pawnBots.__godMode_returnVrfRequestId();
              expect(requestId).to.not.be.equal(initialRequestId);
              await this.contracts.pawnBots.__godMode_fulfillRandomness(requestId, randomNumber);
              expect(await this.contracts.pawnBots.offset()).to.be.equal((randomNumber % 9999) + 1);
            });
          });
        });
      });
    });

    describe("setBaseURI", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setBaseURI("")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";

          await this.contracts.pawnBots.setBaseURI(baseURI);
          expect(await this.contracts.pawnBots.__godMode_returnBaseURI()).to.be.equal(baseURI);
        });
      });
    });

    // TODO: test setClaims

    describe("setProvenanceHash", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setProvenanceHash("")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const provenanceHash = "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";

          await this.contracts.pawnBots.setProvenanceHash(provenanceHash);
          expect(await this.contracts.pawnBots.provenanceHash()).to.be.equal(provenanceHash);
        });
      });
    });

    describe("setRevealTime", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setRevealTime("0")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const contractCall = await this.contracts.pawnBots.setRevealTime("1640641278");
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetRevealTime").withArgs("1640641278");
          expect(await this.contracts.pawnBots.revealTime()).to.be.equal("1640641278");
        });
      });
    });
  });
}
