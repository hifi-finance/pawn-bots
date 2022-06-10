// SPDX-License-Identifier: LGPL-3.0-or-later
// solhint-disable comprehensive-interface
// solhint-disable func-name-mixedcase
pragma solidity >=0.8.4;

import "../PawnBots.sol";

/// @title GodModePawnBots
/// @author Hifi
/// @dev Strictly for test purposes. Do not use in production.
contract GodModePawnBots is PawnBots {
    constructor(
        address chainlinkToken_,
        bytes32 merkleRoot_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) PawnBots(chainlinkToken_, merkleRoot_, vrfCoordinator_, vrfFee_, vrfKeyHash_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        fulfillRandomness(requestId, randomness);
    }

    function __godMode_mint(address to, uint256 mintAmount) external {
        _safeMint(to, mintAmount);
    }

    function __godMode_returnBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function __godMode_returnMerkleRoot() external view returns (bytes32) {
        return merkleRoot;
    }

    function __godMode_returnVrfRequestId() external view returns (bytes32) {
        return vrfRequestId;
    }

    function __godMode_setBaseURI(string calldata newBaseURI) external {
        baseURI = newBaseURI;
    }

    function __godMode_setMaxPerAccount(uint256 newMaxPerAccount) external {
        maxPerAccount = newMaxPerAccount;
    }

    function __godMode_setMintActive(bool newMintActive) external {
        mintActive = newMintActive;
    }

    function __godMode_setMintCap(uint256 newMintCap) external {
        mintCap = newMintCap;
    }

    function __godMode_setMinted(address account, uint256 newMinted) external {
        minted[account] = newMinted;
    }

    function __godMode_setMintPhase(MintPhase newMintPhase) external {
        mintPhase = newMintPhase;
    }

    function __godMode_setOffset(uint256 newOffset) external {
        offset = newOffset;
    }

    function __godMode_setProvenanceHash(string calldata newProvenanceHash) external {
        provenanceHash = newProvenanceHash;
    }

    function __godMode_setReserveMinted(uint256 newReserveMinted) external {
        reserveMinted = newReserveMinted;
    }

    function __godMode_setRevealTime(uint256 newRevealTime) external {
        revealTime = newRevealTime;
    }

    function __godMode_setVrfRequestId(bytes32 newVrfRequestId) external {
        vrfRequestId = newVrfRequestId;
    }
}
