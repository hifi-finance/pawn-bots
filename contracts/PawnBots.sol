// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";
import "./IPawnBots.sol";

error PawnBots__CollectionSizeExceeded();
error PawnBots__MaxReservedElementsExceeded();
error PawnBots__MintIsAlreadyEnabled();
error PawnBots__MintIsNotEnabled();
error PawnBots__NonexistentToken();
error PawnBots__OffsetAlreadySet();
error PawnBots__RandomnessAlreadyRequested();
error PawnBots__TooEarlyToReveal();
error PawnBots__UserAlreadyClaimed();
error PawnBots__UserIsNotEligible();
error PawnBots__VrfRequestIdMismatch();

/// @title PawnBots
/// @author Hifi
/// @notice Manages the mint and distribution of NFTs.
contract PawnBots is IPawnBots, ERC721Enumerable, Ownable, ReentrancyGuard, VRFConsumerBase {
    using Strings for uint256;

    /// STRUCTS ///

    /// PUBLIC STORAGE ///

    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The maximum limit for total amount of NFTs that can be reserved by the project.
    uint256 public constant MAX_RESERVED_ELEMENTS = 1_000;

    /// @inheritdoc IPawnBots
    mapping(address => bool) public override isClaimed;

    /// @inheritdoc IPawnBots
    bool public override isMintEnabled;

    /// @inheritdoc IPawnBots
    uint256 public override offset;

    /// @inheritdoc IPawnBots
    string public override provenanceHash;

    /// @inheritdoc IPawnBots
    uint256 public override reservedElements;

    /// @inheritdoc IPawnBots
    uint256 public override revealTime;

    /// INTERNAL STORAGE ///

    /// @dev The base token URI.
    string internal baseURI;

    /// @dev The whitelist merkle root.
    bytes32 internal merkleRoot;

    /// @dev The Chainlink VRF fee in LINK.
    uint256 internal vrfFee;

    /// @dev The Chainlink VRF key hash.
    bytes32 internal vrfKeyHash;

    /// @dev The Chainlink VRF request ID.
    bytes32 internal vrfRequestId;

    constructor(
        address chainlinkToken_,
        bytes32 merkleRoot_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) ERC721("Pawn Bots", "BOTS") VRFConsumerBase(vrfCoordinator_, chainlinkToken_) {
        merkleRoot = merkleRoot_;
        vrfFee = vrfFee_;
        vrfKeyHash = vrfKeyHash_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @inheritdoc IPawnBots
    function isEligible(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) public view override returns (bool) {
        // TODO: check `abi.encodePacked(...)`
        return MerkleProof.verify(merkleProof, merkleRoot, keccak256(abi.encodePacked(account, amount)));
    }

    /// @dev See {ERC721-tokenURI}.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert PawnBots__NonexistentToken();
        }
        string memory bURI = _baseURI();
        if (offset == 0) {
            return bytes(bURI).length > 0 ? string(abi.encodePacked(bURI, "box", ".json")) : "";
        } else {
            uint256 moddedId = (tokenId + offset) % COLLECTION_SIZE;
            return bytes(bURI).length > 0 ? string(abi.encodePacked(bURI, moddedId.toString(), ".json")) : "";
        }
    }

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @inheritdoc IPawnBots
    function disableMint() public override onlyOwner {
        if (!isMintEnabled) {
            revert PawnBots__MintIsNotEnabled();
        }

        isMintEnabled = false;
        emit DisableMint();
    }

    /// @inheritdoc IPawnBots
    function enableMint() public override onlyOwner {
        if (isMintEnabled) {
            revert PawnBots__MintIsAlreadyEnabled();
        }

        isMintEnabled = true;
        emit EnableMint();
    }

    /// @inheritdoc IPawnBots
    function mint(uint256 mintAmount, bytes32[] calldata merkleProof) public override nonReentrant {
        if (!isMintEnabled) {
            revert PawnBots__MintIsNotEnabled();
        }
        if (mintAmount + totalSupply() > COLLECTION_SIZE) {
            revert PawnBots__CollectionSizeExceeded();
        }
        if (isEligible(msg.sender, mintAmount, merkleProof)) {
            revert PawnBots__UserIsNotEligible();
        }
        if (isClaimed[msg.sender]) {
            revert PawnBots__UserAlreadyClaimed();
        }

        isClaimed[msg.sender] = true;
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply();
            _safeMint(msg.sender, mintId);
        }
        emit Mint(msg.sender, mintAmount);
    }

    /// @inheritdoc IPawnBots
    function reserve(uint256 reserveAmount) public override onlyOwner {
        if (reserveAmount + reservedElements > MAX_RESERVED_ELEMENTS) {
            revert PawnBots__MaxReservedElementsExceeded();
        }

        uint256 totalSupply = totalSupply();
        for (uint256 i = 0; i < reserveAmount; i++) {
            _safeMint(msg.sender, totalSupply + i);
        }
        reservedElements += reserveAmount;
        emit Reserve(reserveAmount);
    }

    /// @inheritdoc IPawnBots
    function reveal() public override onlyOwner {
        if (block.timestamp < revealTime) {
            revert PawnBots__TooEarlyToReveal();
        }
        if (offset != 0) {
            revert PawnBots__OffsetAlreadySet();
        }
        if (vrfRequestId != 0) {
            revert PawnBots__RandomnessAlreadyRequested();
        }

        vrfRequestId = requestRandomness(vrfKeyHash, vrfFee);
    }

    /// @inheritdoc IPawnBots
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        baseURI = newBaseURI;
        emit SetBaseURI(baseURI);
    }

    /// @inheritdoc IPawnBots
    function setProvenanceHash(string memory newProvenanceHash) public override onlyOwner {
        provenanceHash = newProvenanceHash;
        emit SetProvenanceHash(provenanceHash);
    }

    /// @inheritdoc IPawnBots
    function setRevealTime(uint256 newRevealTime) public override onlyOwner {
        revealTime = newRevealTime;
        emit SetRevealTime(newRevealTime);
    }

    /// INTERNAL CONSTANT FUNCTIONS ///

    /// @dev See {ERC721-_baseURI}.
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// INTERNAL NON-CONSTANT FUNCTIONS ///

    /// @dev See {VRFConsumerBase-fulfillRandomness}.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        if (offset != 0) {
            revert PawnBots__OffsetAlreadySet();
        }
        if (vrfRequestId != requestId) {
            revert PawnBots__VrfRequestIdMismatch();
        }

        offset = (randomness % (COLLECTION_SIZE - 1)) + 1;
        emit Reveal();
    }
}
