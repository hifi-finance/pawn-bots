// SPDX-License-Identifier: LGPL-3.0-or-later
// solhint-disable func-name-mixedcase
pragma solidity >=0.8.4;

import "../PBTickets.sol";

/// @title GodModePBTickets
/// @author Hifi
/// @dev Strictly for test purposes. Do not use in production.
contract GodModePBTickets is PBTickets {
    constructor(bytes32 merkleRoot_) PBTickets(merkleRoot_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function __godMode_addEther() external payable {
        // solhint-disable-previous-line no-empty-blocks
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

    function __godMode_setBaseURI(string memory newBaseURI) external {
        baseURI = newBaseURI;
    }

    function __godMode_setIsSaleActive(bool newIsSaleActive) external {
        isSaleActive = newIsSaleActive;
    }

    function __godMode_setMaxMintsPerTx(uint256 newMaxMintsPerTx) external {
        maxMintsPerTx = newMaxMintsPerTx;
    }

    function __godMode_setPrice(uint256 newPrice) external {
        price = newPrice;
    }

    function __godMode_setSaleCap(uint256 newSaleCap) external {
        saleCap = newSaleCap;
    }

    function __godMode_setSaleStartTime(uint256 newSaleStartTime) external {
        saleStartTime = newSaleStartTime;
    }
}
