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
}
