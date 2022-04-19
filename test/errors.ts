export enum PawnBotsErrors {
  INSUFFICIENT_FUNDS_SENT = "PawnBots__InsufficientFundsSent",
  MAX_PRIVATE_PER_ACCOUNT_EXCEEDED = "PawnBots__MaxPrivatePerAccountExceeded",
  MAX_PUBLIC_PER_TX_EXCEEDED = "PawnBots__MaxPublicPerTxExceeded",
  NONEXISTENT_TOKEN = "PawnBots__NonexistentToken",
  OFFSET_ALREADY_SET = "PawnBots__OffsetAlreadySet",
  RANDOMNESS_ALREADY_REQUESTED = "PawnBots__RandomnessAlreadyRequested",
  REMAINING_RESERVE_EXCEEDED = "PawnBots__RemainingReserveExceeded",
  REMAINING_SALE_EXCEEDED = "PawnBots__RemainingSaleExceeded",
  SALE_NOT_ACTIVE = "PawnBots__SaleNotActive",
  SALE_NOT_PAUSED = "PawnBots__SaleNotPaused",
  SALE_PHASE_MISMATCH = "PawnBots__SalePhaseMismatch",
  TOO_EARLY_TO_REVEAL = "PawnBots__TooEarlyToReveal",
  USER_NOT_ELIGIBLE = "PawnBots__UserNotEligible",
  VRF_REQUEST_ID_MISMATCH = "PawnBots__VrfRequestIdMismatch",
}

export enum ImportedErrors {
  CALLER_NOT_OWNER = "Ownable: caller is not the owner",
}
