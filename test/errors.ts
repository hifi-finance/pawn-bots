export enum PawnBotsErrors {
  COLLECTION_SIZE_EXCEEDED = "PawnBots__CollectionSizeExceeded",
  MAX_RESERVED_ELEMENTS_EXCEEDED = "PawnBots__MaxReservedElementsExceeded",
  MINT_IS_ALREADY_ENABLED = "PawnBots__MintIsAlreadyEnabled",
  MINT_IS_NOT_ENABLED = "PawnBots__MintIsNotEnabled",
  NONEXISTENT_TOKEN = "PawnBots__NonexistentToken",
  OFFSET_ALREADY_SET = "PawnBots__OffsetAlreadySet",
  RANDOMNESS_ALREADY_REQUESTED = "PawnBots__RandomnessAlreadyRequested",
  TOO_EARLY_TO_REVEAL = "PawnBots__TooEarlyToReveal",
  USER_ALREADY_CLAIMED = "PawnBots__UserAlreadyClaimed",
  USER_ELIGIBILITY_EXCEEDED = "PawnBots__UserEligibilityExceeded",
  USER_IS_NOT_ELIGIBLE = "PawnBots__UserIsNotEligible",
  VRF_REQUEST_ID_MISMATCH = "PawnBots__VrfRequestIdMismatch",
}

export enum PBTicketsErrors {
  INSUFFICIENT_FUNDS = "PBTickets__InsufficientFunds",
  MAX_ELEMENTS_EXCEEDED = "PBTickets__MaxElementsExceeded",
  MAX_MINTS_PER_TX_EXCEEDED = "PBTickets__MaxMintsPerTxExceeded",
  MINT_NOT_AUTHORIZED = "PBTickets__MintNotAuthorized",
  NONEXISTENT_TOKEN = "PBTickets__NonexistentToken",
  PRIVATE_PHASE_EXPIRED = "PBTickets__PrivatePhaseExpired",
  PUBLIC_PHASE_NOT_STARTED = "PBTickets__PublicPhaseNotStarted",
  SALE_IS_ACTIVE = "PBTickets__SaleIsActive",
  SALE_IS_PAUSED = "PBTickets__SaleIsPaused",
}
