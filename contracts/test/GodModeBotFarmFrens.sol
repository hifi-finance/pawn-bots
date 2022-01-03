// SPDX-License-Identifier: LGPL-3.0-or-later
// solhint-disable func-name-mixedcase
pragma solidity >=0.8.4;

import "../BotFarmFrens.sol";

/// @title GodModeBotFarmFrens
/// @author Hifi
/// @dev Strictly for test purposes. Do not use in production.
contract GodModeBotFarmFrens is BotFarmFrens {
    constructor(
        IERC20Metadata currency_,
        address chainlinkToken_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) BotFarmFrens(currency_, chainlinkToken_, vrfCoordinator_, vrfFee_, vrfKeyHash_) {
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
}
