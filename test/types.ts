import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { GodModePawnBots } from "../src/types/GodModePawnBots";
import type { IERC20 } from "../src/types/IERC20";

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    getMerkleProof: (address: string) => string[];
    signers: Signers;
  }
}

export interface Contracts {
  link: IERC20;
  mft: IERC20;
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
