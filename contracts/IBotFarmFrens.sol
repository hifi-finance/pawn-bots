// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title IBotFarmFrens
/// @author Hifi
interface IBotFarmFrens {
    /// EVENTS ///

    /// @notice Emitted when unsold BFFs are burned from the collection.
    /// @param burnAmount The amount of unsold BFFs burned from the collection.
    event BurnUnsold(uint256 burnAmount);

    /// @notice Emitted when a user mints new BFFs.
    /// @param minter The minter's account address.
    /// @param mintAmount The amount of minted BFFs.
    /// @param fee The total mint fee paid in `currency` units.
    event MintBFF(address indexed minter, uint256 mintAmount, uint256 fee);

    /// @notice Emitted when sale is paused.
    event PauseSale();

    /// @notice Emitted when the collection metadata is revealed.
    event Reveal();

    /// @notice Emitted when base URI is set.
    /// @param oldBaseURI The old base URI.
    /// @param newBaseURI The new base URI.
    event SetBaseURI(string oldBaseURI, string newBaseURI);

    /// @notice Emitted when maximum public mints is set.
    /// @param oldMaxPublicPerTx The old maximum public mints per transaction.
    /// @param newMaxPublicPerTx The new maximum public mints per transaction.
    event SetMaxPublicPerTx(uint256 oldMaxPublicPerTx, uint256 newMaxPublicPerTx);

    /// @notice Emitted when mint price is set.
    /// @param oldPrice The old mint price.
    /// @param newPrice The new mint price.
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    /// @notice Emitted when metadata provenance hash is set.
    /// @param oldProvenanceHash The old provenance hash.
    /// @param newProvenanceHash The new provenance hash.
    event SetProvenanceHash(string oldProvenanceHash, string newProvenanceHash);

    /// @notice Emitted when a new subset of users is added to private sale whitelist.
    /// @param users The user addresses.
    /// @param eligibleAmount The max number of BFFs that can be minted by each user in provided list.
    event SetWhitelist(address[] indexed users, uint256 eligibleAmount);

    /// @notice Emitted when sale is started.
    event StartSale();

    /// @notice Emitted when withdrawing currency.
    /// @param recipient The recipient of currency withdrawn.
    /// @param amount The amount of currency withdrawn.
    event Withdraw(address indexed recipient, uint256 amount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The offset that determines which token ID maps to which token URI.
    function offset() external view returns (uint256);

    /// @notice The ERC20 token used for paying mint fees.
    function currency() external view returns (IERC20Metadata);

    /// @notice The maximum amount of BFFs that can ever exist onchain.
    function maxElements() external view returns (uint256);

    /// @notice The maximum amount of BFFs per user per transaction that can be minted during the public phase.
    function maxPublicPerTx() external view returns (uint256);

    /// @notice The mint price in `currency` units.
    function price() external view returns (uint256);

    /// @notice The metadata provenance hash.
    function provenanceHash() external view returns (string memory);

    /// @notice The sale start timestamp.
    /// Note: the sale starts with the private phase, which lasts 24 hrs.
    function saleStartTime() external view returns (uint256);

    /// @notice The status of the sale.
    function saleIsActive() external view returns (bool);

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

    /// @notice Burn unsold BFFs after the sale.
    ///
    /// @dev Emits a {BurnUnsold} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called when sale is paused.
    /// - `burnAmount` cannot exceed `maxElements` - `totalSupply`.
    ///
    /// @param burnAmount The amount of unsold BFFs to burn.
    function burnUnsold(uint256 burnAmount) external;

    /// @notice Mint new BFFs in exchange for currency.
    ///
    /// @dev Emits a {MintBFF} event.
    ///
    /// Requirements:
    /// - The caller must have allowed this contract to spend currency tokens.
    /// - The caller must have at least `price * mintAmount` currency tokens in their account.
    /// - Sale must be active.
    /// - `mintAmount` cannot exceed `maxElements`.
    /// - For private phase:
    ///   - User must be whitelisted to participate.
    ///   - User must not exceed eligible amount.
    /// - For public phase:
    ///   - User must be exceed the limit for max mints per tx.
    ///
    /// @param mintAmount The amount of BFFs to mint.
    function mintBFF(uint256 mintAmount) external;

    /// @notice Pause the BFF sale.
    ///
    /// @dev Emits a {PauseSale} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Sale must be active.
    function pauseSale() external;

    // TODO: add `reserve` function

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

    /// @notice Set the maximum amount of BFFs that can be minted at public sale phase in one transaction.
    ///
    /// @dev Emits a {SetMaxPublicPerTx} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxPublicPerTx The new maximum public mints per transaction.
    function setMaxPublicPerTx(uint256 newMaxPublicPerTx) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newPrice The new BFF mint price.
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
    /// - Sale must not already be active.
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
