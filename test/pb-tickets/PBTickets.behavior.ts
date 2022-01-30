import { parseEther } from "@ethersproject/units";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ZERO_ADDRESS } from "../constants";
import { timeContext } from "../contexts";
import { PBTicketsErrors } from "../errors";

export function shouldBehaveLikePBTickets(): void {
  describe("Deployment", function () {
    it("should contain the correct constants", async function () {
      expect(await this.contracts.pbTickets.MAX_TICKETS()).to.equal(9000);
      expect(await this.contracts.pbTickets.PRIVATE_DURATION()).to.equal(24 * 60 * 60);
    });
  });

  describe("View Functions", function () {
    describe("isSaleActive", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.isSaleActive()).to.equal(false);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_setIsSaleActive(true);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.isSaleActive()).to.equal(true);
        });
      });
    });

    describe("maxMintsPerTx", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.maxMintsPerTx()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_setMaxMintsPerTx("20");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.maxMintsPerTx()).to.equal("20");
        });
      });
    });

    describe("name", function () {
      it("returns the correct token name", async function () {
        expect(await this.contracts.pbTickets.name()).to.equal("Pawn Bots Mint Tickets");
      });
    });

    describe("price", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.price()).to.equal("0");
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_setPrice("25000000000000000");
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.price()).to.equal("25000000000000000");
        });
      });
    });

    describe("saleCap", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.saleCap()).to.equal(9000);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_setSaleCap(8000);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.saleCap()).to.equal(8000);
        });
      });
    });

    describe("saleStartTime", function () {
      context("when not changed", function () {
        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.saleStartTime()).to.equal(0);
        });
      });

      context("when changed", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_setSaleStartTime(1640551174);
        });

        it("returns the correct value", async function () {
          expect(await this.contracts.pbTickets.saleStartTime()).to.equal(1640551174);
        });
      });
    });

    describe("symbol", function () {
      it("returns the correct token symbol", async function () {
        expect(await this.contracts.pbTickets.symbol()).to.equal("PBTKT");
      });
    });

    describe("tokenURI", function () {
      context("when token does not exist", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.tokenURI(0)).to.be.reverted;
        });
      });

      context("when token exists", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.__godMode_mint(1);
        });

        context("when `baseURI` is not set", function () {
          it("returns the correct value", async function () {
            expect(await this.contracts.pbTickets.tokenURI(0)).to.be.equal("");
          });
        });

        context("when `baseURI` is set", function () {
          beforeEach(async function () {
            this.baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";
            await this.contracts.pbTickets.__godMode_setBaseURI(this.baseURI);
          });

          context("when offset not changed", function () {
            it("returns the correct value", async function () {
              expect(await this.contracts.pbTickets.tokenURI(0)).to.be.equal(this.baseURI + "ticket.json");
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
          await expect(this.contracts.pbTickets.connect(this.signers.alice).burnUnsold(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.pbTickets.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.pbTickets.burnUnsold(0)).to.be.revertedWith(PBTicketsErrors.SALE_IS_ACTIVE);
          });
        });

        context("when sale is not active", function () {
          context("when sale is paused", function () {
            beforeEach(async function () {
              await this.contracts.pbTickets.startSale();
              await this.contracts.pbTickets.pauseSale();
            });

            context("when `burnAmount` is 0", function () {
              it("succeeds", async function () {
                const contractCall = await this.contracts.pbTickets.burnUnsold(0);
                expect(contractCall).to.emit(this.contracts.pbTickets, "BurnUnsold").withArgs(0);
                expect(await this.contracts.pbTickets.saleCap()).to.be.equal(
                  await this.contracts.pbTickets.MAX_TICKETS(),
                );
              });
            });

            context("when `burnAmount` is `MAX_TICKETS`", function () {
              beforeEach(async function () {
                this.maxTickets = await this.contracts.pbTickets.MAX_TICKETS();
              });

              context("if `totalSupply` is 0", function () {
                it("succeeds", async function () {
                  const contractCall = await this.contracts.pbTickets.burnUnsold(this.maxTickets);
                  expect(contractCall).to.emit(this.contracts.pbTickets, "BurnUnsold").withArgs(this.maxTickets);
                  expect(await this.contracts.pbTickets.saleCap()).to.be.equal("0");
                });
              });

              context("if `totalSupply` is greater than 0", function () {
                beforeEach(async function () {
                  await this.contracts.pbTickets.__godMode_mint(1);
                });

                it("reverts", async function () {
                  await expect(this.contracts.pbTickets.burnUnsold(this.maxTickets)).to.be.revertedWith(
                    PBTicketsErrors.SALE_CAP_EXCEEDED,
                  );
                });
              });
            });
          });
        });
      });
    });

    describe("mintPrivate", function () {
      context("when sale is not active", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pbTickets
              .connect(this.signers.alice)
              .mintPrivate(0, this.getMerkleProof(this.signers.alice.address)),
          ).to.be.revertedWith(PBTicketsErrors.SALE_IS_PAUSED);
        });
      });

      context("when sale is active", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.startSale();
          await this.contracts.pbTickets.__godMode_setPrice(parseEther("0.04"));
          await this.contracts.pbTickets.__godMode_setMaxMintsPerTx("5");
        });

        context("when called within the first 24 hours of the sale", function () {
          context("when minter is not whitelisted", function () {
            it("reverts", async function () {
              await expect(
                this.contracts.pbTickets
                  .connect(this.signers.bob)
                  .mintPrivate(1, this.getMerkleProof(this.signers.alice.address)),
              ).to.be.revertedWith(PBTicketsErrors.MINT_NOT_AUTHORIZED);
            });
          });

          context("when minter is whitelisted", function () {
            context("`mintAmount` is greater than `maxMintsPerTx`", function () {
              beforeEach(async function () {
                this.mintAmount = (await this.contracts.pbTickets.maxMintsPerTx()).add(1);
              });

              it("reverts", async function () {
                await expect(
                  this.contracts.pbTickets
                    .connect(this.signers.alice)
                    .mintPrivate(this.mintAmount, this.getMerkleProof(this.signers.alice.address)),
                ).to.be.revertedWith(PBTicketsErrors.MAX_MINTS_PER_TX_EXCEEDED);
              });
            });

            context("`mintAmount` is less than or equal to `maxMintsPerTx`", function () {
              beforeEach(async function () {
                this.mintAmount = await this.contracts.pbTickets.maxMintsPerTx();
              });

              context("when `mintAmount` is greater than `saleCap` minus `totalSupply()`", function () {
                beforeEach(async function () {
                  await this.contracts.pbTickets.__godMode_setSaleCap(this.mintAmount.sub(1));
                  await this.contracts.pbTickets.__godMode_setMaxMintsPerTx(this.mintAmount);
                });

                it("reverts", async function () {
                  await expect(
                    this.contracts.pbTickets
                      .connect(this.signers.alice)
                      .mintPrivate(this.mintAmount, this.getMerkleProof(this.signers.alice.address)),
                  ).to.be.revertedWith(PBTicketsErrors.SALE_CAP_EXCEEDED);
                });
              });

              context("when `mintAmount` is less than or equal to `saleCap` minus `totalSupply()`", function () {
                context("when user sends less funds than the needed value", function () {
                  beforeEach(async function () {
                    this.funds = (await this.contracts.pbTickets.price()).sub(1);
                  });

                  it("reverts", async function () {
                    await expect(
                      this.contracts.pbTickets
                        .connect(this.signers.alice)
                        .mintPrivate(this.mintAmount, this.getMerkleProof(this.signers.alice.address), {
                          value: this.funds,
                        }),
                    ).to.be.revertedWith(PBTicketsErrors.INSUFFICIENT_FUNDS);
                  });
                });

                context("when user sends the exact needed value", function () {
                  beforeEach(async function () {
                    this.funds = (await this.contracts.pbTickets.price()).mul(this.mintAmount);
                  });

                  it("succeeds", async function () {
                    const contractCall = await this.contracts.pbTickets
                      .connect(this.signers.alice)
                      .mintPrivate(this.mintAmount, this.getMerkleProof(this.signers.alice.address), {
                        value: this.funds,
                      });
                    expect(contractCall)
                      .to.emit(this.contracts.pbTickets, "Mint")
                      .withArgs(this.signers.alice.address, this.mintAmount, await this.contracts.pbTickets.price(), 0);
                    expect(await this.contracts.pbTickets.balanceOf(this.signers.alice.address)).to.be.equal(
                      this.mintAmount,
                    );
                    expect(await ethers.provider.getBalance(this.contracts.pbTickets.address)).to.be.equal(this.funds);
                  });
                });

                context("when user sends more than the needed value", function () {
                  beforeEach(async function () {
                    this.funds = (await this.contracts.pbTickets.price()).mul(this.mintAmount).add(parseEther("1"));
                  });

                  it("succeeds", async function () {
                    const contractCall = await this.contracts.pbTickets
                      .connect(this.signers.alice)
                      .mintPrivate(this.mintAmount, this.getMerkleProof(this.signers.alice.address), {
                        value: this.funds,
                      });
                    expect(contractCall)
                      .to.emit(this.contracts.pbTickets, "Mint")
                      .withArgs(this.signers.alice.address, this.mintAmount, await this.contracts.pbTickets.price(), 0);
                    expect(await this.contracts.pbTickets.balanceOf(this.signers.alice.address)).to.be.equal(
                      this.mintAmount,
                    );
                    expect(await ethers.provider.getBalance(this.contracts.pbTickets.address)).to.be.equal(
                      this.funds.sub(parseEther("1")),
                    );
                  });
                });
              });
            });
          });
        });

        timeContext("when called after the first 24 hours of the sale", 86401, function () {
          it("reverts", async function () {
            await expect(
              this.contracts.pbTickets
                .connect(this.signers.alice)
                .mintPrivate(0, this.getMerkleProof(this.signers.alice.address)),
            ).to.be.revertedWith(PBTicketsErrors.PRIVATE_PHASE_EXPIRED);
          });
        });
      });
    });

    describe("mintPublic", function () {
      context("when sale is not active", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.connect(this.signers.alice).mintPublic(0)).to.be.revertedWith(
            PBTicketsErrors.SALE_IS_PAUSED,
          );
        });
      });

      context("when sale is active", function () {
        beforeEach(async function () {
          await this.contracts.pbTickets.startSale();
          await this.contracts.pbTickets.__godMode_setPrice(parseEther("0.04"));
          await this.contracts.pbTickets.__godMode_setMaxMintsPerTx("5");
        });

        timeContext("when called within the first 24 hours of the sale", 86397, function () {
          it("reverts", async function () {
            await expect(this.contracts.pbTickets.connect(this.signers.alice).mintPublic(0)).to.be.revertedWith(
              PBTicketsErrors.PUBLIC_PHASE_NOT_STARTED,
            );
          });
        });

        timeContext("when called after the first 24 hours of the sale", 86401, function () {
          context("`mintAmount` is greater than `maxMintsPerTx`", function () {
            beforeEach(async function () {
              this.mintAmount = (await this.contracts.pbTickets.maxMintsPerTx()).add(1);
            });

            it("reverts", async function () {
              await expect(
                this.contracts.pbTickets.connect(this.signers.alice).mintPublic(this.mintAmount),
              ).to.be.revertedWith(PBTicketsErrors.MAX_MINTS_PER_TX_EXCEEDED);
            });
          });

          context("`mintAmount` is less than or equal to `maxMintsPerTx`", function () {
            beforeEach(async function () {
              this.mintAmount = await this.contracts.pbTickets.maxMintsPerTx();
            });

            context("when `mintAmount` is greater than `saleCap` minus `totalSupply()`", function () {
              beforeEach(async function () {
                await this.contracts.pbTickets.__godMode_setSaleCap(this.mintAmount.sub(1));
                await this.contracts.pbTickets.__godMode_setMaxMintsPerTx(this.mintAmount);
              });

              it("reverts", async function () {
                await expect(
                  this.contracts.pbTickets.connect(this.signers.alice).mintPublic(this.mintAmount),
                ).to.be.revertedWith(PBTicketsErrors.SALE_CAP_EXCEEDED);
              });
            });

            context("when `mintAmount` is less than or equal to `saleCap` minus `totalSupply()`", function () {
              context("when user sends less funds than the needed value", function () {
                beforeEach(async function () {
                  this.funds = (await this.contracts.pbTickets.price()).sub(1);
                });

                it("reverts", async function () {
                  await expect(
                    this.contracts.pbTickets
                      .connect(this.signers.alice)
                      .mintPublic(this.mintAmount, { value: this.funds }),
                  ).to.be.revertedWith(PBTicketsErrors.INSUFFICIENT_FUNDS);
                });
              });

              context("when user sends the exact needed value", function () {
                beforeEach(async function () {
                  this.funds = (await this.contracts.pbTickets.price()).mul(this.mintAmount);
                });

                it("succeeds", async function () {
                  const contractCall = await this.contracts.pbTickets
                    .connect(this.signers.alice)
                    .mintPublic(this.mintAmount, { value: this.funds });
                  expect(contractCall)
                    .to.emit(this.contracts.pbTickets, "Mint")
                    .withArgs(this.signers.alice.address, this.mintAmount, await this.contracts.pbTickets.price(), 1);
                  expect(await this.contracts.pbTickets.balanceOf(this.signers.alice.address)).to.be.equal(
                    this.mintAmount,
                  );
                  expect(await ethers.provider.getBalance(this.contracts.pbTickets.address)).to.be.equal(this.funds);
                });
              });

              context("when user sends more than the needed value", function () {
                beforeEach(async function () {
                  this.funds = (await this.contracts.pbTickets.price()).mul(this.mintAmount).add(parseEther("1"));
                });

                it("succeeds", async function () {
                  const contractCall = await this.contracts.pbTickets
                    .connect(this.signers.alice)
                    .mintPublic(this.mintAmount, { value: this.funds });
                  expect(contractCall)
                    .to.emit(this.contracts.pbTickets, "Mint")
                    .withArgs(this.signers.alice.address, this.mintAmount, await this.contracts.pbTickets.price(), 1);
                  expect(await this.contracts.pbTickets.balanceOf(this.signers.alice.address)).to.be.equal(
                    this.mintAmount,
                  );
                  expect(await ethers.provider.getBalance(this.contracts.pbTickets.address)).to.be.equal(
                    this.funds.sub(parseEther("1")),
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
          await expect(this.contracts.pbTickets.connect(this.signers.alice).pauseSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale is not active", function () {
          it("reverts", async function () {
            await expect(this.contracts.pbTickets.pauseSale()).to.be.revertedWith(PBTicketsErrors.SALE_IS_PAUSED);
          });
        });

        context("when sale is active", function () {
          beforeEach(async function () {
            await this.contracts.pbTickets.startSale();
          });

          it("succeeds", async function () {
            const contractCall = await this.contracts.pbTickets.pauseSale();
            expect(contractCall).to.emit(this.contracts.pbTickets, "PauseSale");
            expect(await this.contracts.pbTickets.isSaleActive()).to.be.equal(false);
          });
        });
      });
    });

    describe("setBaseURI", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.connect(this.signers.alice).setBaseURI("")).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const baseURI = "ipfs://QmYAXgX8ARiriupMQsbGXtKdDyGzWry1YV3sycKw1qqmgH/";

          const contractCall = await this.contracts.pbTickets.setBaseURI(baseURI);
          expect(contractCall).to.emit(this.contracts.pbTickets, "SetBaseURI").withArgs(baseURI);
          expect(await this.contracts.pbTickets.__godMode_returnBaseURI()).to.be.equal(baseURI);
        });
      });
    });

    describe("setMaxMintsPerTx", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.connect(this.signers.alice).setMaxMintsPerTx(0)).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const maxMintsPerCall = 10;

          const contractCall = await this.contracts.pbTickets.setMaxMintsPerTx(maxMintsPerCall);
          expect(contractCall).to.emit(this.contracts.pbTickets, "SetMaxMintsPerTx").withArgs(maxMintsPerCall);
          expect(await this.contracts.pbTickets.maxMintsPerTx()).to.be.equal(maxMintsPerCall);
        });
      });
    });

    describe("setPrice", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.connect(this.signers.alice).setPrice(parseEther("0.1"))).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        it("succeeds", async function () {
          const price = parseEther("0.1");

          const contractCall = await this.contracts.pbTickets.setPrice(price);
          expect(contractCall).to.emit(this.contracts.pbTickets, "SetPrice").withArgs(price);
          expect(await this.contracts.pbTickets.price()).to.be.equal(price);
        });
      });
    });

    describe("startSale", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(this.contracts.pbTickets.connect(this.signers.alice).startSale()).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when sale has already started", function () {
          beforeEach(async function () {
            await this.contracts.pbTickets.startSale();
          });

          it("reverts", async function () {
            await expect(this.contracts.pbTickets.startSale()).to.be.revertedWith(PBTicketsErrors.SALE_IS_ACTIVE);
          });
        });

        context("when sale has not yet started", function () {
          it("succeeds", async function () {
            const contractCall = await this.contracts.pbTickets.startSale();
            expect(contractCall).to.emit(this.contracts.pbTickets, "StartSale");

            const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
            expect(await this.contracts.pbTickets.isSaleActive()).to.be.equal(true);
            expect(await this.contracts.pbTickets.saleStartTime()).to.be.equal(currentTime);
          });
        });

        context("when sale starts after a sale pause", function () {
          beforeEach(async function () {
            await this.contracts.pbTickets.startSale();
            await this.contracts.pbTickets.pauseSale();
          });

          it("succeeds", async function () {
            const startTime = await this.contracts.pbTickets.saleStartTime();

            const contractCall = await this.contracts.pbTickets.startSale();
            expect(contractCall).to.emit(this.contracts.pbTickets, "StartSale");
            expect(await this.contracts.pbTickets.isSaleActive()).to.be.equal(true);
            expect(await this.contracts.pbTickets.saleStartTime()).to.be.equal(startTime);
          });
        });
      });
    });

    describe("withdraw", function () {
      context("when not called by owner", function () {
        it("reverts", async function () {
          await expect(
            this.contracts.pbTickets.connect(this.signers.alice).withdraw(this.signers.alice.address),
          ).to.be.reverted;
        });
      });

      context("when called by owner", function () {
        context("when recipient is the 0 address", function () {
          it("reverts", async function () {
            await expect(this.contracts.pbTickets.withdraw(ZERO_ADDRESS)).to.be.revertedWith(
              PBTicketsErrors.INVALID_RECIPIENT,
            );
          });
        });

        context("when recipient is a valid address", function () {
          beforeEach(async function () {
            this.amount = parseEther("0.1");
            await this.contracts.pbTickets.__godMode_addEther({ value: this.amount });
          });

          it("succeeds", async function () {
            const recipient = this.signers.alice.address;

            const balanceBefore = await this.signers.alice.getBalance();
            const contractCall = await this.contracts.pbTickets.withdraw(recipient);
            expect(contractCall).to.emit(this.contracts.pbTickets, "Withdraw").withArgs(recipient, this.amount);
            const balanceAfter = await this.signers.alice.getBalance();
            expect(balanceAfter.sub(balanceBefore)).to.be.equal(this.amount);
          });
        });
      });
    });
  });
}
