import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { GodModeBotFarmFrens } from "../src/types/GodModeBotFarmFrens";
import { IERC20 } from "../src/types/IERC20";
import type { LinkTokenInterface } from "../src/types/LinkTokenInterface";

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Contracts {
  bff: GodModeBotFarmFrens;
  link: LinkTokenInterface;
  usdc: IERC20;
}

export interface Signers {
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
}
