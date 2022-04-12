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
        bytes32 merkleRoot_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) PawnBots(chainlinkToken_, merkleRoot_, vrfCoordinator_, vrfFee_, vrfKeyHash_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_addEther() external payable {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        fulfillRandomness(requestId, randomness);
    }

    function __godMode_mint(uint256 mintAmount) external {
        _safeMint(msg.sender, mintAmount);
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

    function __godMode_setMaxPrivatePerAccount(uint256 newMaxPrivatePerAccount) external {
        maxPrivatePerAccount = newMaxPrivatePerAccount;
    }

    function __godMode_setMaxPublicPerTx(uint256 newMaxPublicPerTx) external {
        maxPublicPerTx = newMaxPublicPerTx;
    }

    function __godMode_setOffset(uint256 newOffset) external {
        offset = newOffset;
    }

    function __godMode_setPrice(uint256 newPrice) external {
        price = newPrice;
    }

    function __godMode_setPrivateMinted(address account, uint256 newPrivateMinted) external {
        privateMinted[account] = newPrivateMinted;
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

    function __godMode_setSaleActive(bool newSaleActive) external {
        saleActive = newSaleActive;
    }

    function __godMode_setSaleCap(uint256 newSaleCap) external {
        saleCap = newSaleCap;
    }

    function __godMode_setSalePhase(SalePhase newSalePhase) external {
        salePhase = newSalePhase;
    }

    function __godMode_setVrfRequestId(bytes32 newVrfRequestId) external {
        vrfRequestId = newVrfRequestId;
    }
}
