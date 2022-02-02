// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

/// @title IPBTickets
/// @author Hifi
interface IPBTickets {
    /// ENUMS ///

    enum MintPhase {
        PRIVATE,
        PUBLIC
    }

    /// EVENTS ///

    /// @notice Emitted when contract owner burns unsold tickets.
    /// @param burnAmount The amount of unsold tickets burned.
    event BurnUnsold(uint256 burnAmount);

    /// @notice Emitted when a user mints new tickets.
    /// @param minter The minter's account address.
    /// @param mintAmount The amount of minted tickets.
    /// @param price The mint price per ticket that is paid.
    /// @param phase The mint phase.
    event Mint(address indexed minter, uint256 mintAmount, uint256 price, MintPhase phase);

    /// @notice Emitted when tickets are paused or unpaused.
    /// @param state True if paused.
    event PauseTickets(bool state);

    /// @notice Emitted when base URI is set.
    /// @param baseURI The new base URI that is set.
    event SetBaseURI(string baseURI);

    /// @notice Emitted when maximum mints per transaction is set.
    /// @param maxMintsPerTx The new maximum mints per transaction.
    event SetMaxMintsPerTx(uint256 maxMintsPerTx);

    /// @notice Emitted when mint price is set.
    /// @param price The new mint price.
    event SetPrice(uint256 price);

    /// @notice Emitted when sale is started.
    event StartSale();

    /// @notice Emitted when funds are withdrawn from the contract.
    /// @param recipient The recipient of funds withdrawn.
    /// @param amount The amount of funds withdrawn.
    event Withdraw(address indexed recipient, uint256 amount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The maximum amount of tickets that can be minted by a user in one transaction.
    function maxMintsPerTx() external view returns (uint256);

    /// @notice The mint price in ETH.
    function price() external view returns (uint256);

    /// @notice The ticket sale cap.
    function saleCap() external view returns (uint256);

    /// @notice The sale start timestamp.
    function saleStartTime() external view returns (uint256);

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Burn unsold tickets.
    ///
    /// @dev Emits a {BurnUnsold} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called when tickets are paused.
    /// - `burnAmount` cannot exceed `saleCap` - `totalSupply()`.
    ///
    /// @param burnAmount The amount of tickets to burn.
    function burnUnsold(uint256 burnAmount) external;

    /// @notice Mint new tickets in exchange for ETH during the private phase of the sale.
    ///
    /// @dev Emits a {Mint} event.
    ///
    /// @dev Requirements:
    /// - Can only be called when tickets are not paused.
    /// - Can only be called after sale is started.
    /// - Can only be called within the first 24 hours of the sale.
    /// - Caller must be eligible to mint in the private phase.
    /// - `mintAmount` cannot exceed `maxMintsPerTx`.
    /// - `mintAmount` cannot exceed `saleCap` minus `totalSupply()`.
    /// - Can only be called when caller has placed at least `price * mintAmount` ETH as the transaction value.
    ///
    /// @param mintAmount The amount of tickets to mint.
    /// @param merkleProof The merkle proof of caller being eligible to mint.
    function mintPrivate(uint256 mintAmount, bytes32[] calldata merkleProof) external payable;

    /// @notice Mint new tickets in exchange for ETH during the public phase of the sale.
    ///
    /// @dev Emits a {Mint} event.
    ///
    /// @dev Requirements:
    /// - Can only be called when tickets are not paused.
    /// - Can only be called after sale is started.
    /// - Can only be called after the first 24 hours of the sale.
    /// - `mintAmount` cannot exceed `maxMintsPerTx`.
    /// - `mintAmount` cannot exceed `saleCap` minus `totalSupply()`.
    /// - Can only be called when caller has placed at least `price * mintAmount` ETH as the transaction value.
    ///
    /// @param mintAmount The amount of tickets to mint.
    function mintPublic(uint256 mintAmount) external payable;

    /// @notice Pause or unpause ticket minting and transfers.
    ///
    /// @dev Emits a {PauseTickets} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// @param state The new pause state.
    function pauseTickets(bool state) external;

    /// @notice Set the base URI.
    ///
    /// @dev Emits a {SetBaseURI} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newBaseURI The new base URI.
    function setBaseURI(string memory newBaseURI) external;

    /// @notice Set the maximum amount of tickets that can be minted by a user in one transaction.
    ///
    /// @dev Emits a {SetMaxMintsPerTx} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxMintsPerTx The new maximum mints per transaction.
    function setMaxMintsPerTx(uint256 newMaxMintsPerTx) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newPrice The new ticket mint price.
    function setPrice(uint256 newPrice) external;

    /// @notice Start the ticket sale.
    ///
    /// @dev Emits a {StartSale} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called when sale is not started.
    function startSale() external;

    /// @notice Withdraw the accumulated funds in the contract.
    ///
    /// @dev Emits a {Withdraw} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - recipient cannot be the 0 address.
    ///
    /// @param recipient The recipient of funds withdrawn.
    function withdraw(address recipient) external;
}
