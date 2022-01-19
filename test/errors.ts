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
  INSUFFICIENT_FUNDS_SENT = "PBTickets__InsufficientFundsSent",
  MAX_ELEMENTS_EXCEEDED = "PBTickets__MaxElementsExceeded",
  MAX_MINTS_PER_TX_EXCEEDED = "PBTickets__MaxMintsPerTxExceeded",
  NONEXISTENT_TOKEN = "PBTickets__NonexistentToken",
  NOT_WHITELISTED_FOR_PRIVATE_PHASE = "PBTickets__NotWhitelistedForPrivatePhase",
  PRIVATE_PHASE_IS_OVER = "PBTickets__PrivatePhaseIsOver",
  PUBLIC_PHASE_NOT_YET_STARTED = "PBTickets__PublicPhaseNotYetStarted",
  SALE_IS_ACTIVE = "PBTickets__SaleIsActive",
  SALE_IS_NOT_ACTIVE = "PBTickets__SaleIsNotActive",
}
