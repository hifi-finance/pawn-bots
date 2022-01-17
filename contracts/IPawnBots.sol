// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title IPawnBots
/// @author Hifi
interface IPawnBots {
    /// EVENTS ///

    /// @notice Emitted when minting is disabled.
    event DisableMint();

    /// @notice Emitted when minting is enabled.
    event EnableMint();

    /// @notice Emitted when a user mints new NFTs.
    /// @param minter The minter's account address.
    /// @param mintAmount The amount of minted NFTs.
    event Mint(address indexed minter, uint256 mintAmount);

    /// @notice Emitted when NFTs are reserved by the contract owner.
    /// @param reserveAmount The amount of NFTs that were reserved.
    event Reserve(uint256 reserveAmount);

    /// @notice Emitted when the collection metadata is revealed.
    event Reveal();

    /// @notice Emitted when base URI is set.
    /// @param newBaseURI The new base URI that was set.
    event SetBaseURI(string newBaseURI);

    /// @notice Emitted when provenance hash is set.
    /// @param newProvenanceHash The new provenance hash that was set.
    event SetProvenanceHash(string newProvenanceHash);

    /// @notice Emitted when reveal timestamp is set.
    /// @param newRevealTime The new reveal timestamp that was set.
    event SetRevealTime(uint256 newRevealTime);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice Whether an account eligible to mint or not.
    /// @param account The account address to check.
    /// @param merkleProof The merkle proof of the account being eligible to mint.
    function isEligible(address account, bytes32[] calldata merkleProof) external view returns (bool);

    /// @notice A cap on the total amount of NFTs that will ever be minted.
    function mintCap() external view returns (uint256);

    /// @notice Whether minting is enabled or not.
    function mintIsEnabled() external view returns (bool);

    /// @notice The offset that determines how each NFT corresponds to a token URI post-reveal.
    function offset() external view returns (uint256);

    /// @notice The provenance hash of post-reveal art.
    function provenanceHash() external view returns (string memory);

    /// @notice The total amount of NFTs that have been reserved by the contract owner.
    function reservedElements() external view returns (uint256);

    /// @notice The timestamp from which the collection metadata can be revealed.
    function revealTime() external view returns (uint256);

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Disable minting.
    ///
    /// @dev Emits a {DisableMint} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Minting must be enabled when called.
    function disableMint() external;

    /// @notice Enable minting.
    ///
    /// @dev Emits a {EnableMint} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    /// - Minting must be disabled when called.
    function enableMint() external;

    /// @notice Mint new NFTs.
    ///
    /// @dev Emits a {Mint} event.
    ///
    /// Requirements:
    /// - Minting must be enabled.
    /// - Caller must be eligible to mint.
    /// - User must not exceed their eligible amount.
    ///
    /// @param mintAmount The amount of NFTs to mint.
    /// @param merkleProof The merkle proof of caller being eligible to mint.
    function mint(uint256 mintAmount, bytes32[] calldata merkleProof) external;

    /// @notice Reserve a subset of the NFTs in the collection by the contract owner.
    ///
    /// @dev Emits a {Reserve} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - `reserveAmount` cannot exceed max reserve limit minus `reservedElements`.
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

    /// @notice Set the provenance hash once it's calculated.
    ///
    /// @dev Emits a {SetProvenanceHash} event.
    ///
    /// Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newProvenanceHash The new provenance hash.
    function setProvenanceHash(string memory newProvenanceHash) external;

    /// @notice Set the timestamp from which the collection metadata can be revealed.
    ///
    /// @dev Emits a {SetRevealTime} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newRevealTime The new reveal time.
    function setRevealTime(uint256 newRevealTime) external;
}
