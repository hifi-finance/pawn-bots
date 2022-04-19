import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { GodModePawnBots } from "../src/types/GodModePawnBots";
import type { LinkTokenInterface } from "../src/types/LinkTokenInterface";

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    getMerkleProof: (address: string) => string[];
    signers: Signers;
  }
}

export interface Contracts {
  link: LinkTokenInterface;
  pawnBots: GodModePawnBots;
}

export interface Signers {
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  carol: SignerWithAddress;
  dave: SignerWithAddress;
  eve: SignerWithAddress;
}
