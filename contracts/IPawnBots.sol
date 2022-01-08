// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title IPawnBots
/// @author Hifi
interface IPawnBots {
    /// EVENTS ///

    /// @notice Emitted when unsold NFTs are burned from the collection.
    /// @param burnAmount The amount of unsold NFTs burned from the collection.
    event BurnUnsold(uint256 burnAmount);

    /// @notice Emitted when a user mints new NFTs.
    /// @param minter The minter's account address.
    /// @param mintAmount The amount of minted NFTs.
    /// @param fee The total mint fee paid in currency units.
    event MintPawnBots(address indexed minter, uint256 mintAmount, uint256 fee);

    /// @notice Emitted when sale is paused.
    event PauseSale();

    /// @notice Emitted when NFTs are reserved for project usage.
    /// @param reserveAmount The amount of NFTs that were reserved.
    event Reserve(uint256 reserveAmount);

    /// @notice Emitted when the collection metadata is revealed.
    event Reveal();

    /// @notice Emitted when base URI is set.
    /// @param oldBaseURI The old base URI.
    /// @param newBaseURI The new base URI.
    event SetBaseURI(string oldBaseURI, string newBaseURI);

    /// @notice Emitted when maximum public mints per transaction is set.
    /// @param oldMaxPublicMintsPerTx The old maximum public mints per transaction.
    /// @param newMaxPublicMintsPerTx The new maximum public mints per transaction.
    event SetMaxPublicMintsPerTx(uint256 oldMaxPublicMintsPerTx, uint256 newMaxPublicMintsPerTx);

    /// @notice Emitted when mint price is set.
    /// @param oldPrice The old mint price.
    /// @param newPrice The new mint price.
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    /// @notice Emitted when metadata provenance hash is set.
    /// @param oldProvenanceHash The old provenance hash.
    /// @param newProvenanceHash The new provenance hash.
    event SetProvenanceHash(string oldProvenanceHash, string newProvenanceHash);

    /// @notice Emitted when a subset of users is updated in private phase whitelist.
    /// @param users The user addresses.
    /// @param eligibleAmount The maximum number of NFTs that can be minted by each user.
    event SetWhitelist(address[] indexed users, uint256 eligibleAmount);

    /// @notice Emitted when sale is started.
    event StartSale();

    /// @notice Emitted when currency funds are withdrawn from the contract.
    /// @param recipient The recipient of currency withdrawn.
    /// @param amount The amount of currency withdrawn.
    event Withdraw(address indexed recipient, uint256 amount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The ERC20 token used for paying mint fees.
    function currency() external view returns (IERC20Metadata);

    /// @notice The maximum amount of NFTs that can ever exist onchain.
    function maxElements() external view returns (uint256);

    /// @notice The maximum amount of NFTs per user per transaction that can be minted during the public phase.
    function maxPublicMintsPerTx() external view returns (uint256);

    /// @notice The offset that determines which token ID maps to which token URI.
    function offset() external view returns (uint256);

    /// @notice The mint price in currency units.
    function price() external view returns (uint256);

    /// @notice The metadata provenance hash.
    function provenanceHash() external view returns (string memory);

    /// @notice The status of the sale.
    function saleIsActive() external view returns (bool);

    /// @notice The sale start timestamp.
    /// Note: the sale starts with the private phase, which lasts 24 hrs.
    function saleStartTime() external view returns (uint256);

    /// @notice The private phase whitelist.
    function whitelist(address user)
        external
        view
        returns (
            bool exists,
            uint256 claimedAmount,
            uint256 eligibleAmount
        );

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Burn unsold NFTs after the sale.
    ///
    /// @dev Emits a {BurnUnsold} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called when sale is paused.
    /// - `burnAmount` cannot exceed `maxElements` - `totalSupply()`.
    ///
    /// @param burnAmount The amount of unsold NFTs to burn.
    function burnUnsold(uint256 burnAmount) external;

    /// @notice Mint new NFTs in exchange for currency.
    ///
    /// @dev Emits a {MintPawnBots} event.
    ///
    /// Requirements:
    /// - The caller must have allowed this contract to spend currency tokens.
    /// - The caller must have at least `price * mintAmount` currency tokens in their account.
    /// - Sale must be active.
    /// - `mintAmount` cannot exceed `maxElements` - `totalSupply()`.
    /// - For private phase:
    ///   - User must be whitelisted to participate.
    ///   - User must not exceed their eligible amount.
    /// - For public phase:
    ///   - `mintAmount` must be exceed the limit for maximum public mints per tx.
    ///
    /// @param mintAmount The amount of NFTs to mint.
    // TODO: better function name
    function mintPawnBots(uint256 mintAmount) external;

    /// @notice Pause the sale.
    ///
    /// @dev Emits a {PauseSale} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Sale must be active.
    function pauseSale() external;

    /// @notice Reserve collection elements for project usage.
    ///
    /// @dev Emits a {Reserve} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - `reserveAmount` cannot exceed `maxElements` - `totalSupply()`.
    ///
    /// @param reserveAmount The amount of NFTs to reserve.
    function reserve(uint256 reserveAmount) external;

    /// @notice Reveal the collection's metadata.
    ///
    /// @dev Emits a {Reveal} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called once during the contract's lifetime.
    function reveal() external;

    /// @notice Set the base URI.
    ///
    /// @dev Emits a {SetBaseURI} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newBaseURI The new base URI.
    function setBaseURI(string memory newBaseURI) external;

    /// @notice Set the maximum amount of NFTs that can be minted at public phase by
    /// any user in one transaction.
    ///
    /// @dev Emits a {SetMaxPublicMintsPerTx} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxPublicMintsPerTx The new maximum public mints per transaction.
    function setMaxPublicMintsPerTx(uint256 newMaxPublicMintsPerTx) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newPrice The new NFT mint price.
    function setPrice(uint256 newPrice) external;

    /// @notice Set the metadata provenance hash once it's calculated.
    ///
    /// @dev Emits a {SetProvenanceHash} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newProvenanceHash The new provenance hash.
    function setProvenanceHash(string memory newProvenanceHash) external;

    /// @notice Whitelist users for private phase.
    ///
    /// @dev Emits a {SetWhitelist} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param users The user addresses to update.
    /// @param eligibleAmount The amount of NFTs each user in provided list is eligible to mint.
    function setWhitelist(address[] memory users, uint256 eligibleAmount) external;

    /// @notice Start the sale.
    ///
    /// @dev Emits a {StartSale} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Sale must not already be active.
    function startSale() external;

    /// @notice Withdraw the accumulated currency funds in the contract.
    ///
    /// @dev Emits a {Withdraw} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param recipient The recipient of currency withdrawn.
    function withdraw(address recipient) external;
}