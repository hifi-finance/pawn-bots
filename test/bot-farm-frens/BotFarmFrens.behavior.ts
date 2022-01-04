import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { vrfFee } from "../constants";
import { Errors } from "../errors";

export function shouldBehaveLikeBotFarmFrens(): void {
  describe("Deployment", function () {
    it("should contain the correct constants", async function () {
      expect(await this.contracts.bff.COLLECTION_SIZE()).to.equal(10000);
      expect(await this.contracts.bff.PRIVATE_SALE_DURATION()).to.equal(24 * 60 * 60);
    });
  });

  describe("View Functions", function () {
    describe("currency", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.currency()).to.equal("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setCurrency("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.currency()).to.equal("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
        });
      });
    });

    describe("maxElements", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.maxElements()).to.equal(10000);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setMaxElements(7777);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.maxElements()).to.equal(7777);
        });
      });
    });

    describe("maxPublicPerTx", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.maxPublicPerTx()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setMaxPublicPerTx(14);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.maxPublicPerTx()).to.equal(14);
        });
      });
    });

    describe("name", function () {
      it("returns the correct token name", async function () {
        expect(await this.contracts.bff.name()).to.equal("Bot Farm Frens");
      });
    });

    describe("offset", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.offset()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setOffset("1479");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.offset()).to.equal("1479");
        });
      });
    });

    describe("price", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.price()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setPrice("120000000000000000");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.price()).to.equal("120000000000000000");
        });
      });
    });

    describe("provenanceHash", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.provenanceHash()).to.equal("");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setProvenanceHash(
            "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
          );
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.provenanceHash()).to.equal(
            "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
          );
        });
      });
    });

    describe("saleStartTime", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.saleStartTime()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setSaleStartTime(1640551174);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.saleStartTime()).to.equal(1640551174);
        });
      });
    });

    describe("saleIsActive", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.bff.saleIsActive()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setSaleIsActive(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.bff.saleIsActive()).to.equal(true);
        });
      });
    });

    describe("symbol", function () {
      it("returns the correct token symbol", async function () {
        expect(await this.contracts.bff.symbol()).to.equal("BFF");
      });
    });

    describe("tokenURI", function () {
      context("when token does not exist", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.tokenURI(0)).to.be.reverted;
        });
      });

      context("when token exists", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_mint(1);
        });

        context("when `baseURI` is not set", function () {
          it("returns the correct value", async function () {
            expect(await this.contracts.bff.tokenURI(0)).to.be.equal("");
          });
        });

        context("when `baseURI` is set", function () {
          beforeEach(async function () {
            this.baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";
            await this.contracts.bff.__godMode_setBaseURI(this.baseURI);
          });

          context("when offset not changed", function () {
            it("returns the correct value", async function () {
              expect(await this.contracts.bff.tokenURI(0)).to.be.equal(this.baseURI + "box.json");
            });
          });

          context("when offset is changed", function () {
            beforeEach(async function () {
              await this.contracts.bff.__godMode_setOffset(4856);
            });

            it("returns the correct value", async function () {
              expect(await this.contracts.bff.tokenURI(0)).to.be.equal(this.baseURI + "4856.json");
            });
          });
        });
      });
    });

    describe("whitelist", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          const whitelist = await this.contracts.bff.whitelist(this.signers.alice.address);
          expect(whitelist.exists).to.equal(false);
          expect(whitelist.claimedAmount).to.equal(0);
          expect(whitelist.eligibleAmount).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.bff.__godMode_setWhitelist(this.signers.alice.address, true, 7, 10);
        });

        it("returns the correct value", async function () {
          const whitelist = await this.contracts.bff.whitelist(this.signers.alice.address);
          expect(whitelist.exists).to.equal(true);
          expect(whitelist.claimedAmount).to.equal(7);
          expect(whitelist.eligibleAmount).to.equal(10);
        });
      });
    });
  });

  describe("Effects Functions", function () {
    describe("burnUnsold", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).burnUnsold(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.bff.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.bff.burnUnsold(0)).to.be.revertedWith(Errors.SALE_IS_ACTIVE);
          });
        });

        context("when sale is not active", function () {
          context("when sale was never active", function () {
            it("succeeds", async function () {
              await this.contracts.bff.burnUnsold(0);
              expect(await this.contracts.bff.maxElements()).to.be.equal(await this.contracts.bff.COLLECTION_SIZE());
            });
          });

          context("when sale is paused", function () {
            beforeEach(async function () {
              await this.contracts.bff.startSale();
              await this.contracts.bff.pauseSale();
            });

            it("succeeds", async function () {
              await this.contracts.bff.burnUnsold(0);
              expect(await this.contracts.bff.maxElements()).to.be.equal(await this.contracts.bff.COLLECTION_SIZE());
            });
          });
        });
      });
    });

    describe("mintBFF", function () {
      context("when sale is not active", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).mintBFF(0)).to.be.revertedWith(
            Errors.SALE_IS_NOT_ACTIVE,
          );
        });
      });

      context("when sale is active", function () {
        // TODO: add more tests
      });
    });

    describe("pauseSale", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).pauseSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is not active", function () {
          it("reverts", async function () {
            await expect(this.contracts.bff.pauseSale()).to.be.revertedWith(Errors.SALE_IS_NOT_ACTIVE);
          });
        });

        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.bff.startSale();
          });

          it("succeeds", async function () {
            await this.contracts.bff.pauseSale();
            expect(await this.contracts.bff.saleIsActive()).to.be.equal(false);
          });
        });
      });
    });

    describe("reserve", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).reserve(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when `reserveAmount` plus `totalSupply()` exceeds `COLLECTION_SIZE`", function () {
          beforeEach(async function () {
            this.reserveAmount = (await this.contracts.bff.COLLECTION_SIZE()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.bff.reserve(this.reserveAmount)).to.be.revertedWith(
              Errors.MAX_ELEMENTS_EXCEEDED,
            );
          });
        });

        context("when `reserveAmount` plus `totalSupply()` does not exceed `COLLECTION_SIZE`", function () {
          context("when reserving in one call", function () {
            it("succeeds", async function () {
              const reservedElements = 1;

              await this.contracts.bff.reserve(reservedElements);
              expect(await this.contracts.bff.balanceOf(this.signers.admin.address)).to.be.equal(reservedElements);
            });
          });

          context("when reserving through multiple calls", function () {
            it("succeeds", async function () {
              const numberOfCalls = 10;
              const reservedElements = (await this.contracts.bff.COLLECTION_SIZE()).div(100);

              for (let i = 0; i < numberOfCalls; i++) {
                await this.contracts.bff.reserve(reservedElements);
              }
              expect(await this.contracts.bff.balanceOf(this.signers.admin.address)).to.be.equal(
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
          await expect(this.contracts.bff.reveal()).to.be.reverted;
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
          await this.contracts.link.connect(signer).transfer(this.contracts.bff.address, vrfFee);
          await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [linkTeam],
          });
        });

        context("when not called by owner", function () {
          it("reverts", async function () {
            await expect(this.contracts.bff.connect(this.signers.alice).reveal()).to.be.reverted;
          });
        });

        context("when called by owner", function () {
          context("when called again after the first time", function () {
            context("when offset is already set", function () {
              beforeEach(async function () {
                await this.contracts.bff.reveal();
                await this.contracts.bff.__godMode_setOffset("1456");
              });

              it("reverts", async function () {
                await expect(this.contracts.bff.reveal()).to.be.revertedWith(Errors.OFFSET_ALREADY_SET);
              });
            });

            context("when offset is not yet set", function () {
              beforeEach(async function () {
                await this.contracts.bff.reveal();
              });

              it("reverts", async function () {
                await expect(this.contracts.bff.reveal()).to.be.revertedWith(Errors.RANDOMNESS_ALREADY_REQUESTED);
              });
            });
          });

          context("when called for the first time", function () {
            it("succeeds", async function () {
              const randomNumber = 10450;
              const initialRequestId = "0x0000000000000000000000000000000000000000000000000000000000000000";

              await this.contracts.bff.reveal();
              const requestId = await this.contracts.bff.__godMode_returnVrfRequestId();
              expect(requestId).to.not.be.equal(initialRequestId);
              await this.contracts.bff.__godMode_fulfillRandomness(requestId, randomNumber);
              expect(await this.contracts.bff.offset()).to.be.equal((randomNumber % 9999) + 1);
            });
          });
        });
      });
    });

    describe("setBaseURI", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).setBaseURI("")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";

          await this.contracts.bff.setBaseURI(baseURI);
          expect(await this.contracts.bff.__godMode_returnBaseURI()).to.be.equal(baseURI);
        });
      });
    });

    describe("setMaxPublicPerTx", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).setMaxPublicPerTx(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxMintsPerCall = 10;

          await this.contracts.bff.setMaxPublicPerTx(maxMintsPerCall);
          expect(await this.contracts.bff.maxPublicPerTx()).to.be.equal(maxMintsPerCall);
        });
      });
    });

    describe("setPrice", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).setPrice(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const price = 10000000;

          await this.contracts.bff.setPrice(price);
          expect(await this.contracts.bff.price()).to.be.equal(price);
        });
      });
    });

    describe("setProvenanceHash", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).setProvenanceHash("")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const provenanceHash = "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f";

          await this.contracts.bff.setProvenanceHash(provenanceHash);
          expect(await this.contracts.bff.provenanceHash()).to.be.equal(provenanceHash);
        });
      });
    });

    describe("setWhitelist", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.bff
              .connect(this.signers.alice)
              .setWhitelist([this.signers.alice.address, this.signers.bob.address], 10),
          ).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const eligibleAmount = 10;
          await this.contracts.bff.setWhitelist([this.signers.alice.address, this.signers.bob.address], eligibleAmount);
          const aliceWhitelist = await this.contracts.bff.whitelist(this.signers.alice.address);
          const bobWhitelist = await this.contracts.bff.whitelist(this.signers.bob.address);
          expect(aliceWhitelist.exists).to.be.equal(true);
          expect(aliceWhitelist.claimedAmount).to.be.equal(0);
          expect(aliceWhitelist.eligibleAmount).to.be.equal(eligibleAmount);

          expect(bobWhitelist.exists).to.be.equal(true);
          expect(bobWhitelist.claimedAmount).to.be.equal(0);
          expect(bobWhitelist.eligibleAmount).to.be.equal(eligibleAmount);
        });
      });
    });

    describe("startSale", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.bff.connect(this.signers.alice).startSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale has already started", function () {
          beforeEach(async function () {
            await this.contracts.bff.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.bff.startSale()).to.be.revertedWith(Errors.SALE_IS_ACTIVE);
          });
        });

        context("when sale has not yet started", function () {
          it("succeeds", async function () {
            await this.contracts.bff.startSale();

            const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
            expect(await this.contracts.bff.saleIsActive()).to.be.equal(true);
            expect(await this.contracts.bff.saleStartTime()).to.be.equal(currentTime);
          });
        });

        // context("when sale starts after a sale pause", function () {
        //   beforeEach(async function () {
        //     await this.contracts.bff.startSale();
        //     await this.contracts.bff.pauseSale();
        //   });

        //   it("succeeds", async function () {
        //     const saleStartTime = await this.contracts.bff.saleStartTime();
        //     await this.contracts.bff.startSale();
        //     expect(await this.contracts.bff.saleIsActive()).to.be.equal(true);
        //     expect(await this.contracts.bff.saleStartTime()).to.be.equal(saleStartTime);
        //   });
        // });
      });
    });

    describe("withdraw", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.bff.connect(this.signers.alice).withdraw(this.signers.alice.address),
          ).to.be.reverted;
        });
      });

      // context("when called by owner", function () {
      //   it("succeeds", async function () {
      //     await this.contracts.bff.withdraw(this.signers.alice.address);
      //   });
      // });
    });
  });
}
