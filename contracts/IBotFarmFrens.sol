// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title IBotFarmFrens
/// @author Hifi
interface IBotFarmFrens {
    /// EVENTS ///

    /// @notice Emitted when base URI is set.
    /// @param oldBaseURI The old base URI.
    /// @param newBaseURI The new base URI.
    event SetBaseURI(string oldBaseURI, string newBaseURI);

    /// @notice Emitted when mint price is set.
    /// @param oldPrice The old mint price.
    /// @param newPrice The new mint price.
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    /// @notice Emitted when minting BFFs.
    /// @param amount The amount of BFFs minted.
    /// @param payment The total currency tokens paid for minting BFFs.
    event MintBff(uint256 amount, uint256 payment);

    /// @notice Emitted when withdrawing currency.
    /// @param amount The amount of currency withdrawn.
    event Withdraw(uint256 amount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The base token URI.
    function baseURI() external view returns (string memory);

    /// @notice The mint payment token contract.
    function currency() external view returns (IERC20Metadata);

    /// @notice The mint price in currency tokens.
    function price() external view returns (uint256);

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Mint new BFFs in exchange for currency.
    ///
    /// @dev Emits a {MintBff} event.
    ///
    /// Requirements:
    /// - The caller must have allowed this contract to spend currency tokens.
    /// - The caller must have `price * mintAmount` currency tokens in their account.
    ///
    /// @param mintAmount The amount of BFFs to mint.
    function mintBff(uint256 mintAmount) external;

    /// @notice Set the base URI.
    ///
    /// @dev Emits a {SetBaseURI} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newBaseURI The new base URI.
    function setBaseURI(string memory newBaseURI) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newPrice The new BFF mint price.
    function setPrice(uint256 newPrice) external;

    /// @notice Withdraw the currency contained in the contract.
    ///
    /// @dev Emits a {Withdraw} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    function withdraw() external;
}
