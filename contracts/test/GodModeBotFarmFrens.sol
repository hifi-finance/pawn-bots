// SPDX-License-Identifier: LGPL-3.0-or-later
// solhint-disable func-name-mixedcase
pragma solidity >=0.8.4;

import "../PawnBots.sol";

/// @title GodModePawnBots
/// @author Hifi
/// @dev Strictly for test purposes. Do not use in production.
contract GodModePawnBots is PawnBots {
    constructor(
        IERC20Metadata currency_,
        address chainlinkToken_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) PawnBots(currency_, chainlinkToken_, vrfCoordinator_, vrfFee_, vrfKeyHash_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        fulfillRandomness(requestId, randomness);
    }

    function __godMode_mint(uint256 mintAmount) external {
        uint256 mintIndex = totalSupply();
        for (uint256 i = 0; i < mintAmount; i++) {
            _safeMint(msg.sender, mintIndex + i);
        }
    }

    function __godMode_returnBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function __godMode_returnVrfRequestId() external view returns (bytes32) {
        return vrfRequestId;
    }

    function __godMode_setBaseURI(string memory newBaseURI) external {
        baseURI = newBaseURI;
    }

    function __godMode_setCurrency(IERC20Metadata newCurrency) external {
        currency = newCurrency;
    }

    function __godMode_setMaxElements(uint256 newMaxElements) external {
        maxElements = newMaxElements;
    }

    function __godMode_setMaxPublicMintsPerTx(uint256 newMaxPublicMintsPerTx) external {
        maxPublicMintsPerTx = newMaxPublicMintsPerTx;
    }

    function __godMode_setOffset(uint256 newOffset) external {
        offset = newOffset;
    }

    function __godMode_setProvenanceHash(string memory newProvenanceHash) external {
        provenanceHash = newProvenanceHash;
    }

    function __godMode_setPrice(uint256 newPrice) external {
        price = newPrice;
    }

    function __godMode_setSaleStartTime(uint256 newSaleStartTime) external {
        saleStartTime = newSaleStartTime;
    }

    function __godMode_setSaleIsActive(bool newSaleIsActive) external {
        saleIsActive = newSaleIsActive;
    }

    function __godMode_setWhitelist(
        address user,
        bool exists,
        uint256 claimedAmount,
        uint256 eligibleAmount
    ) external {
        whitelist[user].exists = exists;
        whitelist[user].claimedAmount = claimedAmount;
        whitelist[user].eligibleAmount = eligibleAmount;
    }
}