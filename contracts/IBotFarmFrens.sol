// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title IBotFarmFrens
/// @author Hifi
interface IBotFarmFrens {
    /// EVENTS ///

    /// @notice Emitted when minting BFFs.
    /// @param ids The minted BFF IDs.
    /// @param minter The minter address.
    /// @param fee The total mint fee paid in currency units.
    event MintBFF(uint256[] indexed ids, address indexed minter, uint256 fee);

    /// @notice Emitted when sale is paused.
    event PauseSale();

    /// @notice Emitted when base URI is set.
    /// @param oldBaseURI The old base URI.
    /// @param newBaseURI The new base URI.
    event SetBaseURI(string oldBaseURI, string newBaseURI);

    /// @notice Emitted when maximum public mints is set.
    /// @param oldMaxPublicMints The old maximum public mints.
    /// @param newMaxPublicMints The new maximum public mints.
    event SetMaxPublicMints(uint256 oldMaxPublicMints, uint256 newMaxPublicMints);

    /// @notice Emitted when mint price is set.
    /// @param oldPrice The old mint price.
    /// @param newPrice The new mint price.
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    /// @notice Emitted when a new subset of users is added to private sale whitelist.
    /// @param users The user addresses.
    /// @param eligibleAmount The amount of BFFs each user in provided list is eligible to mint.
    event SetWhitelist(address[] indexed users, uint256 eligibleAmount);

    /// @notice Emitted when sale is started.
    event StartSale();

    /// @notice Emitted when withdrawing currency.
    /// @param recipient The recipient of currency withdrawn.
    /// @param amount The amount of currency withdrawn.
    event Withdraw(address indexed recipient, uint256 amount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The base token URI.
    function baseURI() external view returns (string memory);

    /// @notice The contract of token used for paying mint fees.
    function currency() external view returns (IERC20Metadata);

    /// @notice The maximum number of BFFs that can be minted in one transaction at public sale phase.
    function maxPublicMints() external view returns (uint256);

    /// @notice The mint price in currency tokens.
    function price() external view returns (uint256);

    /// @notice The sale start timestamp.
    /// Note: the sale starts with the private phase.
    function saleStartTime() external view returns (uint256);

    /// @notice The status of the sale.
    function saleEnabled() external view returns (bool);

    /// @notice The private sale phase whitelist.
    function whitelist(address user)
        external
        view
        returns (
            bool exists,
            uint256 eligibleAmount,
            uint256 claimedAmount
        );

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Mint new BFFs in exchange for currency.
    ///
    /// @dev Emits a {MintBFF} event.
    ///
    /// Requirements:
    /// - The caller must have allowed this contract to spend currency tokens.
    /// - The caller must have at least `price * mintAmount` currency tokens in their account.
    ///
    /// @param mintAmount The amount of BFFs to mint.
    function mintBFF(uint256 mintAmount) external;

    /// @notice Pause the BFF sale.
    ///
    /// @dev Emits a {PauseSale} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    function pauseSale() external;

    /// @notice Set the base URI.
    ///
    /// @dev Emits a {SetBaseURI} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newBaseURI The new base URI.
    function setBaseURI(string memory newBaseURI) external;

    /// @notice Set the maximum number of BFFs that can be minted in one transaction at public sale phase.
    ///
    /// @dev Emits a {SetMaxPublicMints} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxPublicMints The new maximum public mints.
    function setMaxPublicMints(uint256 newMaxPublicMints) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newPrice The new BFF mint price.
    function setPrice(uint256 newPrice) external;

    /// @notice Whitelist users to the private sale phase.
    ///
    /// @dev Emits a {SetWhitelist} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param users The user addresses to whitelist for private sale phase.
    /// @param eligibleAmount The amount of BFFs each user in provided list is eligible to mint.
    function setWhitelist(address[] memory users, uint256 eligibleAmount) external;

    /// @notice Start the BFF sale.
    ///
    /// @dev Emits a {StartSale} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    function startSale() external;

    /// @notice Withdraw the currency contained in the contract.
    ///
    /// @dev Emits a {Withdraw} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param recipient The recipient of currency withdrawn.
    function withdraw(address recipient) external;
}
