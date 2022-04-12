// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

/// @title IPawnBots
/// @author Hifi
interface IPawnBots {
    /// ENUMS ///

    enum SalePhase {
        PRIVATE,
        PUBLIC
    }

    /// EVENTS ///

    /// @notice Emitted when unsold tokens are burned.
    /// @param burnAmount The amount of tokens burned.
    event BurnUnsold(uint256 burnAmount);

    /// @notice Emitted when a user account mints new tokens.
    /// @param minter The minter account address.
    /// @param mintAmount The amount of minted tokens.
    /// @param price The mint price paid per each minted token.
    /// @param phase The sale phase.
    event Mint(address indexed minter, uint256 mintAmount, uint256 price, SalePhase phase);

    /// @notice Emitted when reserved tokens are minted.
    /// @param reserveAmount The amount of reserved tokens minted.
    event Reserve(uint256 reserveAmount);

    /// @notice Emitted when the collection metadata is revealed.
    event Reveal();

    /// @notice Emitted when base URI is set.
    /// @param newBaseURI The new base URI.
    event SetBaseURI(string newBaseURI);

    /// @notice Emitted when the per-account private mint limit is set.
    /// @param newMaxPrivatePerAccount The new per-account private mint limit.
    event SetMaxPrivatePerAccount(uint256 newMaxPrivatePerAccount);

    /// @notice Emitted when the per-transaction public mint limit is set.
    /// @param newMaxPublicPerTx The new per-transaction public mint limit.
    event SetMaxPublicPerTx(uint256 newMaxPublicPerTx);

    /// @notice Emitted when Merkle root is set.
    /// @param newMerkleRoot The new Merkle root.
    event SetMerkleRoot(bytes32 newMerkleRoot);

    /// @notice Emitted when mint price is set.
    /// @param newPrice The new mint price.
    event SetPrice(uint256 newPrice);

    /// @notice Emitted when provenance hash is set.
    /// @param newProvenanceHash The new provenance hash.
    event SetProvenanceHash(string newProvenanceHash);

    /// @notice Emitted when reveal timestamp is set.
    /// @param newRevealTime The new reveal timestamp.
    event SetRevealTime(uint256 newRevealTime);

    /// @notice Emitted when the sale state is set.
    /// @param newSaleActive The new sale state.
    event SetSaleActive(bool newSaleActive);

    /// @notice Emitted when the sale phase is set.
    /// @param newSalePhase The new sale phase.
    event SetSalePhase(SalePhase newSalePhase);

    /// @notice Emitted when ethers are withdrawn from the contract.
    /// @param withdrawAmount The amount of ethers withdrawn.
    event Withdraw(uint256 withdrawAmount);

    /// @notice Emitted when ERC-20 tokens are withdrawn from the contract.
    /// @param token The token contract address.
    /// @param withdrawAmount The amount of tokens withdrawn.
    event WithdrawErc20(address indexed token, uint256 withdrawAmount);

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @notice The per-account private mint limit.
    function maxPrivatePerAccount() external view returns (uint256);

    /// @notice The per-transaction public mint limit.
    function maxPublicPerTx() external view returns (uint256);

    /// @notice The offset that determines how each token ID corresponds to a token URI post-reveal.
    function offset() external view returns (uint256);

    /// @notice The mint price in ethers.
    function price() external view returns (uint256);

    /// @notice The total amount of tokens minted by a given user account during the private phase.
    /// @param account The user account address.
    function privateMinted(address account) external view returns (uint256);

    /// @notice The provenance hash of post-reveal art.
    function provenanceHash() external view returns (string memory);

    /// @notice The total amount of reserved tokens minted.
    function reserveMinted() external view returns (uint256);

    /// @notice The timestamp from which the collection metadata can be revealed.
    function revealTime() external view returns (uint256);

    /// @notice The state of the sale.
    function saleActive() external view returns (bool);

    /// @notice The token sale cap.
    function saleCap() external view returns (uint256);

    /// @notice The current sale phase.
    function salePhase() external view returns (SalePhase);

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @notice Burn unsold tokens.
    ///
    /// @dev Emits a {BurnUnsold} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called when token sale is paused.
    /// - `burnAmount` cannot exceed remaining sale.
    ///
    /// @param burnAmount The amount of tokens to burn.
    function burnUnsold(uint256 burnAmount) external;

    /// @notice Mint new tokens in exchange for ethers during the private phase of the sale.
    ///
    /// @dev Emits a {Mint} event.
    ///
    /// @dev Requirements:
    /// - Can only be called when token sale is active.
    /// - Can only be called during private sale phase.
    /// - Caller must be eligible to mint during the private phase.
    /// - `mintAmount` cannot exceed caller's private mint limit.
    /// - `mintAmount` cannot exceed remaining sale.
    /// - Can only be called when caller has placed enough ethers in the transaction value.
    ///
    /// @param mintAmount The amount of tokens to mint.
    /// @param merkleProof The merkle proof of caller being eligible to mint.
    function mintPrivate(uint256 mintAmount, bytes32[] calldata merkleProof) external payable;

    /// @notice Mint new tokens in exchange for ethers during the public phase of the sale.
    ///
    /// @dev Emits a {Mint} event.
    ///
    /// @dev Requirements:
    /// - Can only be called when token sale is active.
    /// - Can only be called during public sale phase.
    /// - `mintAmount` cannot exceed public mint limit.
    /// - `mintAmount` cannot exceed remaining sale.
    /// - Can only be called when caller has placed enough ethers in the transaction value.
    ///
    /// @param mintAmount The amount of tokens to mint.
    function mintPublic(uint256 mintAmount) external payable;

    /// @notice Mint reserved tokens.
    ///
    /// @dev Emits a {Reserve} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - `reserveAmount` cannot exceed remaining reserve.
    ///
    /// @param reserveAmount The amount of reserved tokens to mint.
    function reserve(uint256 reserveAmount) external;

    /// @notice Reveal the collection metadata.
    ///
    /// @dev Emits a {Reveal} event indirectly through a transaction initiated by the VRF Coordinator.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - Can only be called after `revealTime` has passed.
    /// - Can only be called once during the contract's lifetime.
    function reveal() external;

    /// @notice Set the base URI.
    ///
    /// @dev Emits a {SetBaseURI} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newBaseURI The new base URI.
    function setBaseURI(string calldata newBaseURI) external;

    /// @notice Set the per-account private mint limit.
    ///
    /// @dev Emits a {SetMaxPrivatePerAccount} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxPrivatePerAccount The new per-account private mint limit.
    function setMaxPrivatePerAccount(uint256 newMaxPrivatePerAccount) external;

    /// @notice Set the per-transaction public mint limit.
    ///
    /// @dev Emits a {SetMaxPublicPerTx} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMaxPublicPerTx The new per-transaction public mint limit.
    function setMaxPublicPerTx(uint256 newMaxPublicPerTx) external;

    /// @notice Set the Merkle root of private phase allow list.
    ///
    /// @dev Emits a {SetMerkleRoot} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newMerkleRoot The new Merkle root.
    function setMerkleRoot(bytes32 newMerkleRoot) external;

    /// @notice Set the mint price.
    ///
    /// @dev Emits a {SetPrice} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    /// - `newPrice` cannot exceed max price limit.
    ///
    /// @param newPrice The new mint price in ethers.
    function setPrice(uint256 newPrice) external;

    /// @notice Set the provenance hash of post-reveal art.
    ///
    /// @dev Emits a {SetProvenanceHash} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newProvenanceHash The new provenance hash.
    function setProvenanceHash(string calldata newProvenanceHash) external;

    /// @notice Set the timestamp from which the collection metadata can be revealed.
    ///
    /// @dev Emits a {SetRevealTime} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newRevealTime The new reveal time.
    function setRevealTime(uint256 newRevealTime) external;

    /// @notice Set the state of the sale.
    ///
    /// @dev Emits a {SetSaleActive} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newSaleActive The new sale state.
    function setSaleActive(bool newSaleActive) external;

    /// @notice Set the current sale phase.
    ///
    /// @dev Emits a {SetSalePhase} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param newSalePhase The new sale phase.
    function setSalePhase(SalePhase newSalePhase) external;

    /// @notice Withdraw from the accumulated ether balance in the contract.
    ///
    /// @dev Emits a {Withdraw} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param withdrawAmount The amount of ethers to withdraw.
    function withdraw(uint256 withdrawAmount) external;

    /// @notice Withdraw any ERC-20 token balances in the contract.
    ///
    /// @dev Emits a {WithdrawErc20} event.
    ///
    /// @dev Requirements:
    /// - Can only be called by the owner.
    ///
    /// @param token The token contract address.
    /// @param withdrawAmount The amount of tokens to withdraw.
    function withdrawErc20(address token, uint256 withdrawAmount) external;
}
