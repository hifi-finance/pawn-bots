// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./IBotFarmFrens.sol";

error BotFarmFrens__MaxBffsMintExceeded();
error BotFarmFrens__MaxBffsSupplyExceeded();
error BotFarmFrens__InsufficientCurrency();

/// @title BotFarmFrens
/// @author Hifi
/// @notice Manages the mint and distribution of BFFs.
contract BotFarmFrens is IBotFarmFrens, ERC721Enumerable, Ownable {
    /// PUBLIC STORAGE ///

    /// @inheritdoc IBotFarmFrens
    string public override baseURI;

    /// @inheritdoc IBotFarmFrens
    IERC20Metadata public override currency;

    /// @inheritdoc IBotFarmFrens
    uint256 public override price;

    /// INTERNAL STORAGE ///

    /// @dev The maximum possible number of BFFs that can be minted in one transaction.
    uint256 internal constant MAX_BFFS_MINT = 5;

    /// @dev The maximum possible number of BFFs in the collection.
    uint256 internal constant MAX_BFFS_SUPPLY = 10_000;

    constructor(IERC20Metadata currency_) ERC721("Bot Farm Frens", "BFF") {
        // solhint-disable-previous-line no-empty-blocks
        currency = currency_;
        price = 100 * 10**currency.decimals();
    }

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @inheritdoc IBotFarmFrens
    function mintBFF(uint256 mintAmount) public override {
        if (mintAmount > MAX_BFFS_MINT) {
            revert BotFarmFrens__MaxBffsMintExceeded();
        }
        if (mintAmount + totalSupply() > MAX_BFFS_SUPPLY) {
            revert BotFarmFrens__MaxBffsSupplyExceeded();
        }
        uint256 fee = price * mintAmount;
        if (currency.balanceOf(msg.sender) < fee) {
            revert BotFarmFrens__InsufficientCurrency();
        }
        currency.transferFrom(msg.sender, address(this), fee);
        uint256[] memory mintedIds = new uint256[](mintAmount);
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply();
            _safeMint(msg.sender, mintId);
            mintedIds[i] = mintId;
        }
        emit MintBFF(mintedIds, msg.sender, fee);
    }

    /// @inheritdoc IBotFarmFrens
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        string memory oldBaseURI = baseURI;
        baseURI = newBaseURI;
        emit SetBaseURI(oldBaseURI, baseURI);
    }

    /// @inheritdoc IBotFarmFrens
    function setPrice(uint256 newPrice) public override onlyOwner {
        uint256 oldPrice = price;
        price = newPrice;
        emit SetPrice(oldPrice, price);
    }

    /// @inheritdoc IBotFarmFrens
    function withdraw(address recipient) public override onlyOwner {
        uint256 amount = currency.balanceOf(address(this));
        currency.transfer(recipient, amount);
        emit Withdraw(recipient, amount);
    }
}
