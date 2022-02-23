export enum PawnBotsErrors {
  COLLECTION_SIZE_EXCEEDED = "PawnBots__CollectionSizeExceeded",
  MINT_IS_ALREADY_ENABLED = "PawnBots__MintIsAlreadyEnabled",
  MINT_IS_NOT_ENABLED = "PawnBots__MintIsNotEnabled",
  NONEXISTENT_TOKEN = "PawnBots__NonexistentToken",
  OFFSET_ALREADY_SET = "PawnBots__OffsetAlreadySet",
  RANDOMNESS_ALREADY_REQUESTED = "PawnBots__RandomnessAlreadyRequested",
  RESERVE_CAP_EXCEEDED = "PawnBots__ReserveCapExceeded",
  TOO_EARLY_TO_REVEAL = "PawnBots__TooEarlyToReveal",
  USER_ELIGIBILITY_EXCEEDED = "PawnBots__UserEligibilityExceeded",
  USER_IS_NOT_ELIGIBLE = "PawnBots__UserIsNotEligible",
  VRF_REQUEST_ID_MISMATCH = "PawnBots__VrfRequestIdMismatch",
}

export enum PBTicketsErrors {
  INSUFFICIENT_FUNDS = "PBTickets__InsufficientFunds",
  INVALID_RECIPIENT = "PBTickets__InvalidRecipient",
  MAX_PRIVATE_MINTS_EXCEEDED = "PBTickets__MaxPrivateMintsExceeded",
  MAX_PUBLIC_MINTS_PER_TX_EXCEEDED = "PBTickets__MaxPublicMintsPerTxExceeded",
  MINT_NOT_AUTHORIZED = "PBTickets__MintNotAuthorized",
  NONEXISTENT_TOKEN = "PBTickets__NonexistentToken",
  PRIVATE_PHASE_EXPIRED = "PBTickets__PrivatePhaseExpired",
  PUBLIC_PHASE_NOT_STARTED = "PBTickets__PublicPhaseNotStarted",
  SALE_ALREADY_STARTED = "PBTickets__SaleAlreadyStarted",
  SALE_CAP_EXCEEDED = "PBTickets__SaleCapExceeded",
  SALE_NOT_STARTED = "PBTickets__SaleNotStarted",
}

export enum ImportedErrors {
  CALLER_NOT_OWNER = "Ownable: caller is not the owner",
  NOT_PAUSED = "Pausable: not paused",
  PAUSED = "Pausable: paused",
}
