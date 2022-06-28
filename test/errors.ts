export enum PawnBotsErrors {
  ACCOUNT_NOT_ALLOWED = "PawnBots__AccountNotAllowed",
  MAX_PER_ACCOUNT_EXCEEDED = "PawnBots__MaxPerAccountExceeded",
  MINT_NOT_ACTIVE = "PawnBots__MintNotActive",
  MINT_NOT_PAUSED = "PawnBots__MintNotPaused",
  MINT_PHASE_MISMATCH = "PawnBots__MintPhaseMismatch",
  NONEXISTENT_TOKEN = "PawnBots__NonexistentToken",
  NOT_ENOUGH_MFT_BALANCE = "PawnBots__NotEnoughMftBalance",
  OFFSET_ALREADY_SET = "PawnBots__OffsetAlreadySet",
  RANDOMNESS_ALREADY_REQUESTED = "PawnBots__RandomnessAlreadyRequested",
  REMAINING_MINTS_EXCEEDED = "PawnBots__RemainingMintsExceeded",
  REMAINING_RESERVE_EXCEEDED = "PawnBots__RemainingReserveExceeded",
  TOO_EARLY_TO_REVEAL = "PawnBots__TooEarlyToReveal",
  VRF_REQUEST_ID_MISMATCH = "PawnBots__VrfRequestIdMismatch",
}

export enum ImportedErrors {
  CALLER_NOT_OWNER = "Ownable: caller is not the owner",
}
