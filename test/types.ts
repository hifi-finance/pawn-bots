import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { GodModePawnBots } from "../src/types/GodModePawnBots";
import type { GodModePBTickets } from "../src/types/GodModePBTickets";
import type { LinkTokenInterface } from "../src/types/LinkTokenInterface";

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    getMerkleProof: (address: string) => string[];
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Contracts {
  link: LinkTokenInterface;
  pawnBots: GodModePawnBots;
  pbTickets: GodModePBTickets;
}

export interface Signers {
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  carol: SignerWithAddress;
  dave: SignerWithAddress;
  eve: SignerWithAddress;
}
