import { expect } from "chai";
import { ethers, network } from "hardhat";

import { VRF_FEE } from "../constants";
import { timeContext } from "../contexts";
import { ImportedErrors, PawnBotsErrors } from "../errors";

export function shouldBehaveLikePawnBots(): void {
  describe("Deployment", function () {
    it("should deploy with the correct values", async function () {
      // TODO
      // expect(await this.contracts.pawnBots.COLLECTION_SIZE()).to.equal(10000);
      // expect(await this.contracts.pawnBots.RESERVE_CAP()).to.equal(1000);
      expect(await this.contracts.pawnBots.name()).to.equal("Pawn Bots");
      expect(await this.contracts.pawnBots.symbol()).to.equal("BOTS");
    });
  });

  describe("View Functions", function () {
    describe("maxPrivatePerAccount", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPrivatePerAccount()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMaxPrivatePerAccount(20);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPrivatePerAccount()).to.equal(20);
        });
      });
    });

    describe("maxPublicPerTx", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPublicPerTx()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMaxPublicPerTx(20);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPublicPerTx()).to.equal(20);
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

    describe("price", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.price()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setPrice(250000000000000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.price()).to.equal(250000000000000);
        });
      });
    });

    describe("privateMinted", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.privateMinted(this.signers.alice.address)).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setPrivateMinted(this.signers.alice.address, 20);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.privateMinted(this.signers.alice.address)).to.equal(20);
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

    describe("saleCap", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleCap()).to.equal(9000);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setSaleCap(8000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleCap()).to.equal(8000);
        });
      });
    });

    describe("saleActive", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleActive()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setSaleActive(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleActive()).to.equal(true);
        });
      });
    });

    describe("salePhase", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          // TODO: define js type
          expect(await this.contracts.pawnBots.salePhase()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setSalePhase("1");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.salePhase()).to.equal("1");
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
        context("when sale is not paused", function () {
          it("reverts", async function () {
            await expect(this.contracts.pawnBots.burnUnsold(0)).to.be.revertedWith(ImportedErrors.NOT_PAUSED);
          });
        });

        context("when sale is paused", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.__godMode_setSaleActive(false);
          });

          context("when `burnAmount` is 0", function () {
            it("succeeds", async function () {
              const contractCall = await this.contracts.pawnBots.burnUnsold(0);
              expect(contractCall).to.emit(this.contracts.pawnBots, "BurnUnsold").withArgs(0);
              // TODO: replace `MAX_TICKETS`
              expect(await this.contracts.pawnBots.saleCap()).to.be.equal(await this.contracts.pawnBots.MAX_TICKETS());
            });
          });

          context("when `burnAmount` is `MAX_TICKETS`", function () {
            beforeEach(async function () {
              this.maxTickets = await this.contracts.pawnBots.MAX_TICKETS();
            });

            context("if `totalSupply` is 0", function () {
              it("succeeds", async function () {
                const contractCall = await this.contracts.pawnBots.burnUnsold(this.maxTickets);
                expect(contractCall).to.emit(this.contracts.pawnBots, "BurnUnsold").withArgs(this.maxTickets);
                expect(await this.contracts.pawnBots.saleCap()).to.be.equal(0);
              });
            });

            context("if `totalSupply` is greater than 0", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.__godMode_mint(1);
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.burnUnsold(this.maxTickets)).to.be.revertedWith(
                  PawnBotsErrors.SALE_CAP_EXCEEDED,
                );
              });
            });
          });
        });
      });
    });

    describe("mintPrivate", function () {
      // TODO
    });

    describe("mintPublic", function () {
      // TODO
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
        context("when `reserveAmount` exceeds reserve cap minus `reserveMinted`", function () {
          beforeEach(async function () {
            const reserveMinted = 10;
            await this.contracts.pawnBots.__godMode_setReserveMinted(reserveMinted);
            this.reserveAmount = (await this.contracts.pawnBots.RESERVE_CAP())
              .sub(await this.contracts.pawnBots.reserveMinted())
              .add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.reserve(this.reserveAmount)).to.be.revertedWith(
              PawnBotsErrors.RESERVE_CAP_EXCEEDED,
            );
          });
        });

        context("when `reserveAmount` does not exceed reserve cap minus `reserveMinted`", function () {
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

    describe("setMaxPrivatePerAccount", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots.connect(this.signers.alice).setMaxPrivatePerAccount(0),
          ).to.be.revertedWith(ImportedErrors.CALLER_NOT_OWNER);
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxPrivatePerAccount = 10;

          const contractCall = await this.contracts.pawnBots.setMaxPrivatePerAccount(maxPrivatePerAccount);
          expect(contractCall)
            .to.emit(this.contracts.pawnBots, "SetMaxPrivatePerAccount")
            .withArgs(maxPrivatePerAccount);
          expect(await this.contracts.pawnBots.maxPrivatePerAccount()).to.be.equal(maxPrivatePerAccount);
        });
      });
    });

    describe("setMaxPublicPerTx", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setMaxPublicPerTx(0)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxPublicPerTx = 10;

          const contractCall = await this.contracts.pawnBots.setMaxPublicPerTx(maxPublicPerTx);
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetMaxPublicPerTx").withArgs(maxPublicPerTx);
          expect(await this.contracts.pawnBots.maxPublicPerTx()).to.be.equal(maxPublicPerTx);
        });
      });
    });

    describe("setMerkleRoot", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).setMerkleRoot("")).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const merkleRoot = "0xdffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";

          const contractCall = await this.contracts.pawnBots.setMerkleRoot(merkleRoot);
          expect(contractCall).to.emit(this.contracts.pawnBots, "SetMerkleRoot").withArgs(merkleRoot);
          expect(await this.contracts.pawnBots.merkleRoot()).to.be.equal(merkleRoot);
        });
      });
    });

    describe("setPrice", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots.connect(this.signers.alice).setPrice(parseEther("0.1")),
          ).to.be.revertedWith(ImportedErrors.CALLER_NOT_OWNER);
        });
      });

      context("when called by owner", function () {
        context("when `newPrice` exceeds max price limit", function () {
          beforeEach(async function () {
            this.newPrice = (await this.contracts.pawnBots.MAX_PRICE()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.setPrice(this.newPrice)).to.be.revertedWith(
              PawnBotsErrors.MAX_PRICE_EXCEEDED,
            );
          });
        });

        context("when `newPrice` does not exceed max price limit", function () {
          beforeEach(async function () {
            this.newPrice = await this.contracts.pawnBots.MAX_PRICE();
          });

          it("succeeds", async function () {
            const contractCall = await this.contracts.pawnBots.setPrice(this.newPrice);
            expect(contractCall).to.emit(this.contracts.pawnBots, "SetPrice").withArgs(this.newPrice);
            expect(await this.contracts.pawnBots.price()).to.be.equal(this.newPrice);
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

    describe("setSaleActive", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setSaleActive(false)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        // TODO
      });
    });

    describe("setSalePhase", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setSalePhase("0")).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        // TODO
      });
    });

    describe("withdraw (ethers)", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          const signer = this.signers.alice;
          await expect(this.contracts.pawnBots.connect(signer).withdraw(signer.address)).to.be.revertedWith(
            ImportedErrors.CALLER_NOT_OWNER,
          );
        });
      });

      context("when called by owner", function () {
        context("when recipient is the 0 address", function () {
          it("reverts", async function () {
            await expect(this.contracts.pawnBots.withdraw(ZERO_ADDRESS)).to.be.revertedWith(
              PawnBotsErrors.INVALID_RECIPIENT,
            );
          });
        });

        context("when recipient is a valid address", function () {
          beforeEach(async function () {
            this.amount = parseEther("0.1");
            await this.contracts.pawnBots.__godMode_addEther({ value: this.amount });
          });

          it("succeeds", async function () {
            const signer = this.signers.alice;
            const balanceBefore = await signer.getBalance();
            const contractCall = await this.contracts.pawnBots.withdraw(signer.address);
            expect(contractCall).to.emit(this.contracts.pawnBots, "Withdraw").withArgs(signer.address, this.amount);
            const balanceAfter = await signer.getBalance();
            expect(balanceAfter.sub(balanceBefore)).to.be.equal(this.amount);
          });
        });
      });
    });

    describe("withdraw (tokens)", function () {
      // TODO
    });
  });
}
