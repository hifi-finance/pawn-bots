// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./IBotFarmFrens.sol";

error BotFarmFrens__MaxBffsMintOverflow();
error BotFarmFrens__MaxBffsSupplyOverflow();
error BotFarmFrens__NotEnoughCurrency();

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
    function mintBff(uint256 mintAmount) public override {
        if (mintAmount > MAX_BFFS_MINT) {
            revert BotFarmFrens__MaxBffsMintOverflow();
        }
        if (mintAmount + totalSupply() > MAX_BFFS_SUPPLY) {
            revert BotFarmFrens__MaxBffsSupplyOverflow();
        }
        if (currency.balanceOf(msg.sender) < price * mintAmount) {
            revert BotFarmFrens__NotEnoughCurrency();
        }
        currency.transferFrom(msg.sender, address(this), price * mintAmount);
        for (uint256 i = 0; i < mintAmount; i++) {
            _safeMint(msg.sender, totalSupply());
        }
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
    function withdraw() public override onlyOwner {
        uint256 amount = currency.balanceOf(address(this));
        currency.transfer(msg.sender, amount);
        emit Withdraw(amount);
    }
}
