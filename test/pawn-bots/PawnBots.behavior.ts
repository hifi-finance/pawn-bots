import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { vrfFee } from "../constants";
import { Errors } from "../errors";

export function shouldBehaveLikePawnBots(): void {
  describe("Deployment", function () {
    it("should contain the correct constants", async function () {
      expect(await this.contracts.pawnBots.COLLECTION_SIZE()).to.equal(10000);
      expect(await this.contracts.pawnBots.PRIVATE_SALE_DURATION()).to.equal(24 * 60 * 60);
    });
  });

  describe("View Functions", function () {
    describe("currency", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.currency()).to.equal("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setCurrency("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.currency()).to.equal("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
        });
      });
    });

    describe("maxElements", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxElements()).to.equal(10000);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMaxElements(7777);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxElements()).to.equal(7777);
        });
      });
    });

    describe("maxPublicMintsPerTx", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPublicMintsPerTx()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setMaxPublicMintsPerTx(14);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.maxPublicMintsPerTx()).to.equal(14);
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

    describe("price", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.price()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setPrice("120000000000000000");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.price()).to.equal("120000000000000000");
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

    describe("saleStartTime", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleStartTime()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setSaleStartTime(1640551174);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleStartTime()).to.equal(1640551174);
        });
      });
    });

    describe("saleIsActive", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleIsActive()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setSaleIsActive(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pawnBots.saleIsActive()).to.equal(true);
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

    describe("whitelist", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          const whitelist = await this.contracts.pawnBots.whitelist(this.signers.alice.address);
          expect(whitelist.exists).to.equal(false);
          expect(whitelist.claimedAmount).to.equal(0);
          expect(whitelist.eligibleAmount).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pawnBots.__godMode_setWhitelist(this.signers.alice.address, true, 7, 10);
        });

        it("returns the correct value", async function () {
          const whitelist = await this.contracts.pawnBots.whitelist(this.signers.alice.address);
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
          await expect(this.contracts.pawnBots.connect(this.signers.alice).burnUnsold(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.burnUnsold(0)).to.be.revertedWith(Errors.SALE_IS_ACTIVE);
          });
        });

        context("when sale is not active", function () {
          context("when sale was never active", function () {
            it("succeeds", async function () {
              const burnAmount = 1250;
              await this.contracts.pawnBots.burnUnsold(burnAmount);
              expect(await this.contracts.pawnBots.maxElements()).to.be.equal(
                (await this.contracts.pawnBots.COLLECTION_SIZE()).sub(burnAmount),
              );
            });
          });

          context("when sale is paused", function () {
            beforeEach(async function () {
              await this.contracts.pawnBots.startSale();
              await this.contracts.pawnBots.pauseSale();
            });

            it("succeeds", async function () {
              const burnAmount = 1250;
              await this.contracts.pawnBots.burnUnsold(burnAmount);
              expect(await this.contracts.pawnBots.maxElements()).to.be.equal(
                (await this.contracts.pawnBots.COLLECTION_SIZE()).sub(burnAmount),
              );
            });
          });
        });
      });
    });

    describe("mint", function () {
      context("when sale is not active", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).mint(0)).to.be.revertedWith(
            Errors.SALE_IS_NOT_ACTIVE,
          );
        });
      });

      context("when sale is active", function () {
        beforeEach(async function () {
          this.price = 800000000;
          await this.contracts.pawnBots.setPrice(this.price);
          await this.contracts.pawnBots.setMaxPublicMintsPerTx(5);
          await this.contracts.pawnBots.startSale();
        });

        context("when `mintAmount` plus `totalSupply()` exceeds `maxElements`", function () {
          beforeEach(async function () {
            this.mintAmount = (await this.contracts.pawnBots.maxElements()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount)).to.be.revertedWith(
              Errors.MAX_ELEMENTS_EXCEEDED,
            );
          });
        });

        context("when `mintAmount` plus `totalSupply()` does not exceed `maxElements`", function () {
          beforeEach(async function () {
            this.mintAmount = 10;
          });

          context("when called within first 24 hrs of the sale (private phase)", function () {
            context("when caller is not whitelisted for private phase", function () {
              it("reverts", async function () {
                await expect(
                  this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
                ).to.be.revertedWith(Errors.NOT_WHITELISTED_FOR_PRIVATE_PHASE);
              });
            });

            context("when caller is whitelisted for private phase", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.setWhitelist([this.signers.alice.address], this.mintAmount);
              });

              context("when `mintAmount` plus `claimedAmount` exceeds `eligibleAmount` for user", function () {
                beforeEach(async function () {
                  await this.contracts.pawnBots.__godMode_setWhitelist(
                    this.signers.alice.address,
                    true,
                    this.mintAmount,
                    this.mintAmount,
                  );
                });

                it("reverts", async function () {
                  await expect(
                    this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
                  ).to.be.revertedWith(Errors.ELIGIBILITY_EXCEEDED_FOR_PRIVATE_PHASE);
                });
              });

              context("when `mintAmount` plus `claimedAmount` does not exceed `eligibleAmount` for user", function () {
                context("when user does not have enough currency to pay mint fee", function () {
                  it("reverts", async function () {
                    await expect(
                      this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
                    ).to.be.reverted;
                  });
                });

                context("when user has enough currency to pay mint fee", function () {
                  beforeEach(async function () {
                    const usdcWhale = "0x06959153B974D0D5fDfd87D561db6d8d4FA0bb0B";
                    await network.provider.request({
                      method: "hardhat_impersonateAccount",
                      params: [usdcWhale],
                    });
                    const signer = await ethers.getSigner(usdcWhale);
                    await this.contracts.usdc
                      .connect(signer)
                      .transfer(this.signers.alice.address, this.price * this.mintAmount);
                    await network.provider.request({
                      method: "hardhat_stopImpersonatingAccount",
                      params: [usdcWhale],
                    });
                    await this.contracts.usdc
                      .connect(this.signers.alice)
                      .approve(this.contracts.pawnBots.address, ethers.constants.MaxUint256);
                  });

                  it("succeeds", async function () {
                    await this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount);
                    expect(await this.contracts.pawnBots.balanceOf(this.signers.alice.address)).to.be.equal(
                      this.mintAmount,
                    );
                  });
                });
              });
            });
          });

          context("when called after first 24 hrs of the sale (public phase)", function () {
            beforeEach(async function () {
              const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
              this.snapshot = await network.provider.send("evm_snapshot");
              await network.provider.send("evm_setNextBlockTimestamp", [currentTime + 86401]);
            });

            afterEach(async function () {
              await network.provider.send("evm_revert", [this.snapshot]);
            });

            context("when `mintAmount` exceeds `maxPublicMintsPerTx`", function () {
              beforeEach(async function () {
                this.mintAmount = (await this.contracts.pawnBots.maxPublicMintsPerTx()).add(1);
              });

              it("reverts", async function () {
                await expect(
                  this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
                ).to.be.revertedWith(Errors.MAX_MINTS_PER_TX_EXCEEDED_FOR_PUBLIC_PHASE);
              });
            });

            context("when `mintAmount` does not exceed `maxPublicMintsPerTx`", function () {
              beforeEach(async function () {
                this.mintAmount = await this.contracts.pawnBots.maxPublicMintsPerTx();
              });

              context("when user does not have enough currency to pay mint fee", function () {
                it("reverts", async function () {
                  await expect(
                    this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount),
                  ).to.be.reverted;
                });
              });

              context("when user has enough currency to pay mint fee", function () {
                beforeEach(async function () {
                  const usdcWhale = "0x06959153B974D0D5fDfd87D561db6d8d4FA0bb0B";
                  await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [usdcWhale],
                  });
                  const signer = await ethers.getSigner(usdcWhale);
                  await this.contracts.usdc
                    .connect(signer)
                    .transfer(this.signers.alice.address, this.price * this.mintAmount);
                  await network.provider.request({
                    method: "hardhat_stopImpersonatingAccount",
                    params: [usdcWhale],
                  });
                  await this.contracts.usdc
                    .connect(this.signers.alice)
                    .approve(this.contracts.pawnBots.address, ethers.constants.MaxUint256);
                });

                it("succeeds", async function () {
                  await this.contracts.pawnBots.connect(this.signers.alice).mint(this.mintAmount);
                  expect(await this.contracts.pawnBots.balanceOf(this.signers.alice.address)).to.be.equal(
                    this.mintAmount,
                  );
                });
              });
            });
          });
        });
      });
    });

    describe("pauseSale", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).pauseSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is not active", function () {
          it("reverts", async function () {
            await expect(this.contracts.pawnBots.pauseSale()).to.be.revertedWith(Errors.SALE_IS_NOT_ACTIVE);
          });
        });

        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.startSale();
          });

          it("succeeds", async function () {
            await this.contracts.pawnBots.pauseSale();
            expect(await this.contracts.pawnBots.saleIsActive()).to.be.equal(false);
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
        context("when `reserveAmount` plus `totalSupply()` exceeds `maxElements`", function () {
          beforeEach(async function () {
            this.reserveAmount = (await this.contracts.pawnBots.maxElements()).add(1);
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.reserve(this.reserveAmount)).to.be.revertedWith(
              Errors.MAX_ELEMENTS_EXCEEDED,
            );
          });
        });

        context("when `reserveAmount` plus `totalSupply()` does not exceed `maxElements`", function () {
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
              const reservedElements = (await this.contracts.pawnBots.maxElements()).div(100);

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
          await this.contracts.link.connect(signer).transfer(this.contracts.pawnBots.address, vrfFee);
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
                await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(Errors.OFFSET_ALREADY_SET);
              });
            });

            context("when offset is not yet set", function () {
              beforeEach(async function () {
                await this.contracts.pawnBots.reveal();
              });

              it("reverts", async function () {
                await expect(this.contracts.pawnBots.reveal()).to.be.revertedWith(Errors.RANDOMNESS_ALREADY_REQUESTED);
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

    describe("setMaxPublicMintsPerTx", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setMaxPublicMintsPerTx(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxMintsPerCall = 10;

          await this.contracts.pawnBots.setMaxPublicMintsPerTx(maxMintsPerCall);
          expect(await this.contracts.pawnBots.maxPublicMintsPerTx()).to.be.equal(maxMintsPerCall);
        });
      });
    });

    describe("setPrice", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pawnBots.connect(this.signers.alice).setPrice(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const price = 10000000;

          await this.contracts.pawnBots.setPrice(price);
          expect(await this.contracts.pawnBots.price()).to.be.equal(price);
        });
      });
    });

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

    describe("setWhitelist", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots
              .connect(this.signers.alice)
              .setWhitelist([this.signers.alice.address, this.signers.bob.address], 10),
          ).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const eligibleAmount = 10;
          await this.contracts.pawnBots.setWhitelist(
            [this.signers.alice.address, this.signers.bob.address],
            eligibleAmount,
          );
          const aliceWhitelist = await this.contracts.pawnBots.whitelist(this.signers.alice.address);
          const bobWhitelist = await this.contracts.pawnBots.whitelist(this.signers.bob.address);
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
          await expect(this.contracts.pawnBots.connect(this.signers.alice).startSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale has already started", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.pawnBots.startSale()).to.be.revertedWith(Errors.SALE_IS_ACTIVE);
          });
        });

        context("when sale has not yet started", function () {
          it("succeeds", async function () {
            await this.contracts.pawnBots.startSale();

            const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
            expect(await this.contracts.pawnBots.saleIsActive()).to.be.equal(true);
            expect(await this.contracts.pawnBots.saleStartTime()).to.be.equal(currentTime);
          });
        });

        context("when sale starts after a sale pause", function () {
          beforeEach(async function () {
            await this.contracts.pawnBots.startSale();
            await this.contracts.pawnBots.pauseSale();
          });

          it("succeeds", async function () {
            const saleStartTime = await this.contracts.pawnBots.saleStartTime();
            await this.contracts.pawnBots.startSale();
            expect(await this.contracts.pawnBots.saleIsActive()).to.be.equal(true);
            expect(await this.contracts.pawnBots.saleStartTime()).to.be.equal(saleStartTime);
          });
        });
      });
    });

    describe("withdraw", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pawnBots.connect(this.signers.alice).withdraw(this.signers.alice.address),
          ).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        beforeEach(async function () {
          this.withdrawAmount = 2500000000;
          const usdcWhale = "0x06959153B974D0D5fDfd87D561db6d8d4FA0bb0B";
          await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [usdcWhale],
          });
          const signer = await ethers.getSigner(usdcWhale);
          await this.contracts.usdc.connect(signer).transfer(this.contracts.pawnBots.address, this.withdrawAmount);
          await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [usdcWhale],
          });
        });

        it("succeeds", async function () {
          await this.contracts.pawnBots.withdraw(this.signers.bob.address);
          expect(await this.contracts.usdc.balanceOf(this.signers.bob.address)).to.be.equal(this.withdrawAmount);
        });
      });
    });
  });
}
