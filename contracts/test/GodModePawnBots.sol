// SPDX-License-Identifier: LGPL-3.0-or-later
// solhint-disable func-name-mixedcase
pragma solidity >=0.8.4;

import "../PawnBots.sol";

/// @title GodModePawnBots
/// @author Hifi
/// @dev Strictly for test purposes. Do not use in production.
contract GodModePawnBots is PawnBots {
    constructor(
        address chainlinkToken_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) PawnBots(chainlinkToken_, vrfCoordinator_, vrfFee_, vrfKeyHash_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        fulfillRandomness(requestId, randomness);
    }

    function __godMode_mint(uint256 mintAmount) external {
        uint256 mintIndex = totalSupply();
        for (uint256 i = 0; i < mintAmount; ++i) {
            _safeMint(msg.sender, mintIndex + i);
        }
    }

    function __godMode_returnBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function __godMode_returnVrfRequestId() external view returns (bytes32) {
        return vrfRequestId;
    }

    function __godMode_setBaseURI(string calldata newBaseURI) external {
        baseURI = newBaseURI;
    }

    function __godMode_setClaim(address user, Claim memory newClaim) external {
        claims[user] = newClaim;
    }

    function __godMode_setIsMintEnabled(bool newIsMintEnabled) external {
        isMintEnabled = newIsMintEnabled;
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
