// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./IBotFarmFrens.sol";

error BotFarmFrens__EligibilityExceeded();
error BotFarmFrens__InsufficientCurrency();
error BotFarmFrens__MaxElementsExceeded();
error BotFarmFrens__MaxPublicMintsExceeded();
error BotFarmFrens__NotWhitelisted();
error BotFarmFrens__SaleAlreadyStarted();
error BotFarmFrens__SaleIsDisabled();

/// @title BotFarmFrens
/// @author Hifi
/// @notice Manages the mint and distribution of BFFs.
contract BotFarmFrens is IBotFarmFrens, ERC721Enumerable, Ownable {
    /// STRUCTS ///

    struct WhitelistElement {
        bool exists;
        uint256 eligibleAmount;
        uint256 claimedAmount;
    }

    /// PUBLIC STORAGE ///

    /// @inheritdoc IBotFarmFrens
    string public override baseURI;

    /// @inheritdoc IBotFarmFrens
    IERC20Metadata public override currency;

    /// @inheritdoc IBotFarmFrens
    uint256 public override maxPublicMints;

    /// @inheritdoc IBotFarmFrens
    uint256 public override price;

    /// @inheritdoc IBotFarmFrens
    uint256 public override saleStartTime;

    /// @inheritdoc IBotFarmFrens
    bool public override saleEnabled;

    /// @inheritdoc IBotFarmFrens
    mapping(address => WhitelistElement) public override whitelist;

    /// @dev The maximum possible number of BFFs in the collection.
    uint256 public constant MAX_ELEMENTS = 10_000;

    /// @dev The private sale duration from the sale start timestamp.
    uint256 public constant PRIVATE_SALE_DURATION = 1 days;

    /// INTERNAL STORAGE ///

    constructor(IERC20Metadata currency_) ERC721("Bot Farm Frens", "BFF") {
        currency = currency_;
    }

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @inheritdoc IBotFarmFrens
    function mintBFF(uint256 mintAmount) public override {
        if (!saleEnabled) {
            revert BotFarmFrens__SaleIsDisabled();
        }
        if (mintAmount + totalSupply() > MAX_ELEMENTS) {
            revert BotFarmFrens__MaxElementsExceeded();
        }
        if (block.timestamp <= saleStartTime + PRIVATE_SALE_DURATION) {
            // private phase
            if (!whitelist[msg.sender].exists) {
                revert BotFarmFrens__NotWhitelisted();
            }
            if (mintAmount > whitelist[msg.sender].eligibleAmount - whitelist[msg.sender].claimedAmount) {
                revert BotFarmFrens__EligibilityExceeded();
            }
            whitelist[msg.sender].claimedAmount += mintAmount;
        } else {
            // public phase
            if (mintAmount > maxPublicMints) {
                revert BotFarmFrens__MaxPublicMintsExceeded();
            }
        }

        uint256 fee = price * mintAmount;
        receiveFeeInternal(mintAmount);

        uint256[] memory mintedIds = new uint256[](mintAmount);
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply();
            _safeMint(msg.sender, mintId);
            mintedIds[i] = mintId;
        }
        emit MintBFF(mintedIds, msg.sender, fee);
    }

    /// @inheritdoc IBotFarmFrens
    function pauseSale() public override onlyOwner {
        saleEnabled = false;
        emit PauseSale();
    }

    /// @inheritdoc IBotFarmFrens
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        string memory oldBaseURI = baseURI;
        baseURI = newBaseURI;
        emit SetBaseURI(oldBaseURI, baseURI);
    }

    /// @inheritdoc IBotFarmFrens
    function setMaxPublicMints(uint256 newMaxPublicMints) public override onlyOwner {
        uint256 oldMaxPublicMints = maxPublicMints;
        maxPublicMints = newMaxPublicMints;
        emit SetMaxPublicMints(oldMaxPublicMints, maxPublicMints);
    }

    /// @inheritdoc IBotFarmFrens
    function setPrice(uint256 newPrice) public override onlyOwner {
        uint256 oldPrice = price;
        price = newPrice;
        emit SetPrice(oldPrice, price);
    }

    /// @inheritdoc IBotFarmFrens
    function setWhitelist(address[] memory users, uint256 eligibleAmount) public override onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            WhitelistElement memory elem;
            elem.exists = true;
            elem.eligibleAmount = eligibleAmount;
            whitelist[users[i]] = elem;
        }
        emit SetWhitelist(users, eligibleAmount);
    }

    /// @inheritdoc IBotFarmFrens
    function startSale() public override onlyOwner {
        if (saleEnabled) {
            revert BotFarmFrens__SaleAlreadyStarted();
        }
        saleStartTime = block.timestamp;
        saleEnabled = true;
        emit StartSale();
    }

    /// @inheritdoc IBotFarmFrens
    function withdraw(address recipient) public override onlyOwner {
        uint256 amount = currency.balanceOf(address(this));
        currency.transfer(recipient, amount);
        emit Withdraw(recipient, amount);
    }

    /// INTERNAL NON-CONSTANT FUNCTIONS ///

    /// @notice Receive fee from user in currency units.
    /// @param fee The fee amount to receive in currency units.
    function receiveFeeInternal(uint256 fee) internal {
        if (currency.balanceOf(msg.sender) < fee) {
            revert BotFarmFrens__InsufficientCurrency();
        }
        currency.transferFrom(msg.sender, address(this), fee);
    }
}
