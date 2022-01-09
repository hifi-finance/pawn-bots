// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./IPawnBots.sol";

error PawnBots__EligibilityExceededForPrivatePhase();
error PawnBots__InsufficientCurrencySent();
error PawnBots__MaxElementsExceeded();
error PawnBots__MaxMintsPerTxExceededForPublicPhase();
error PawnBots__NonexistentToken();
error PawnBots__NotWhitelistedForPrivatePhase();
error PawnBots__OffsetAlreadySet();
error PawnBots__RandomnessAlreadyRequested();
error PawnBots__SaleIsActive();
error PawnBots__SaleIsNotActive();
error PawnBots__VrfRequestIdMismatch();

/// @title PawnBots
/// @author Hifi
/// @notice Manages the mint and distribution of NFTs.
contract PawnBots is IPawnBots, ERC721Enumerable, Ownable, ReentrancyGuard, VRFConsumerBase {
    using Strings for uint256;

    /// STRUCTS ///

    struct WhitelistElement {
        bool exists;
        uint256 claimedAmount;
        uint256 eligibleAmount;
    }

    /// PUBLIC STORAGE ///

    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The private sale duration from the sale start timestamp.
    uint256 public constant PRIVATE_SALE_DURATION = 24 hours;

    /// @inheritdoc IPawnBots
    IERC20Metadata public override currency;

    /// @inheritdoc IPawnBots
    uint256 public override maxElements = COLLECTION_SIZE;

    /// @inheritdoc IPawnBots
    uint256 public override maxPublicMintsPerTx;

    /// @inheritdoc IPawnBots
    uint256 public override offset;

    /// @inheritdoc IPawnBots
    uint256 public override price;

    /// @inheritdoc IPawnBots
    string public override provenanceHash;

    /// @inheritdoc IPawnBots
    bool public override saleIsActive;

    /// @inheritdoc IPawnBots
    uint256 public override saleStartTime;

    /// @inheritdoc IPawnBots
    mapping(address => WhitelistElement) public override whitelist;

    /// INTERNAL STORAGE ///

    /// @dev The base token URI.
    string internal baseURI;

    /// @dev The Chainlink VRF fee in LINK.
    uint256 internal vrfFee;

    /// @dev The Chainlink VRF key hash.
    bytes32 internal vrfKeyHash;

    /// @dev The Chainlink VRF request ID.
    bytes32 internal vrfRequestId;

    constructor(
        IERC20Metadata currency_,
        address chainlinkToken_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) ERC721("Pawn Bots", "BOTS") VRFConsumerBase(vrfCoordinator_, chainlinkToken_) {
        currency = currency_;
        vrfFee = vrfFee_;
        vrfKeyHash = vrfKeyHash_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

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
    function burnUnsold(uint256 burnAmount) public override onlyOwner {
        if (saleIsActive) {
            revert PawnBots__SaleIsActive();
        }
        if (burnAmount + totalSupply() > maxElements) {
            revert PawnBots__MaxElementsExceeded();
        }

        maxElements -= burnAmount;
        emit BurnUnsold(burnAmount);
    }

    /// @inheritdoc IPawnBots
    function mint(uint256 mintAmount) public override nonReentrant {
        if (!saleIsActive) {
            revert PawnBots__SaleIsNotActive();
        }
        if (mintAmount + totalSupply() > maxElements) {
            revert PawnBots__MaxElementsExceeded();
        }
        if (block.timestamp <= saleStartTime + PRIVATE_SALE_DURATION) {
            // private phase
            if (!whitelist[msg.sender].exists) {
                revert PawnBots__NotWhitelistedForPrivatePhase();
            }
            if (mintAmount > whitelist[msg.sender].eligibleAmount - whitelist[msg.sender].claimedAmount) {
                revert PawnBots__EligibilityExceededForPrivatePhase();
            }
            whitelist[msg.sender].claimedAmount += mintAmount;
        } else {
            // public phase
            if (mintAmount > maxPublicMintsPerTx) {
                revert PawnBots__MaxMintsPerTxExceededForPublicPhase();
            }
        }

        uint256 fee = price * mintAmount;
        receiveFeeInternal(fee);
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply();
            _safeMint(msg.sender, mintId);
        }
        emit Mint(msg.sender, mintAmount, fee);
    }

    /// @inheritdoc IPawnBots
    function pauseSale() public override onlyOwner {
        if (!saleIsActive) {
            revert PawnBots__SaleIsNotActive();
        }

        saleIsActive = false;
        emit PauseSale();
    }

    /// @inheritdoc IPawnBots
    function reserve(uint256 reserveAmount) public override onlyOwner {
        uint256 totalSupply = totalSupply();
        if (reserveAmount + totalSupply > maxElements) {
            revert PawnBots__MaxElementsExceeded();
        }

        for (uint256 i = 0; i < reserveAmount; i++) {
            _safeMint(msg.sender, totalSupply + i);
        }
        emit Reserve(reserveAmount);
    }

    /// @inheritdoc IPawnBots
    function reveal() public override onlyOwner {
        if (offset != 0) {
            revert PawnBots__OffsetAlreadySet();
        }
        if (vrfRequestId != 0) {
            revert PawnBots__RandomnessAlreadyRequested();
        }

        vrfRequestId = requestRandomness(vrfKeyHash, vrfFee);
        emit Reveal();
    }

    /// @inheritdoc IPawnBots
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        string memory oldBaseURI = baseURI;
        baseURI = newBaseURI;
        emit SetBaseURI(oldBaseURI, baseURI);
    }

    /// @inheritdoc IPawnBots
    function setMaxPublicMintsPerTx(uint256 newMaxPublicMintsPerTx) public override onlyOwner {
        uint256 oldMaxPublicMintsPerTx = maxPublicMintsPerTx;
        maxPublicMintsPerTx = newMaxPublicMintsPerTx;
        emit SetMaxPublicMintsPerTx(oldMaxPublicMintsPerTx, maxPublicMintsPerTx);
    }

    /// @inheritdoc IPawnBots
    function setPrice(uint256 newPrice) public override onlyOwner {
        uint256 oldPrice = price;
        price = newPrice;
        emit SetPrice(oldPrice, price);
    }

    /// @inheritdoc IPawnBots
    function setProvenanceHash(string memory newProvenanceHash) public override onlyOwner {
        string memory oldProvenanceHash = provenanceHash;
        provenanceHash = newProvenanceHash;
        emit SetProvenanceHash(oldProvenanceHash, provenanceHash);
    }

    /// @inheritdoc IPawnBots
    function setWhitelist(address[] memory users, uint256 eligibleAmount) public override onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            WhitelistElement memory elem;
            elem.exists = true;
            elem.eligibleAmount = eligibleAmount;
            whitelist[users[i]] = elem;
        }
        emit SetWhitelist(users, eligibleAmount);
    }

    /// @inheritdoc IPawnBots
    function startSale() public override onlyOwner {
        if (saleIsActive) {
            revert PawnBots__SaleIsActive();
        }
        if (saleStartTime == 0) {
            saleStartTime = block.timestamp;
        }
        saleIsActive = true;
        emit StartSale();
    }

    /// @inheritdoc IPawnBots
    function withdraw(address recipient) public override onlyOwner {
        uint256 amount = currency.balanceOf(address(this));
        currency.transfer(recipient, amount);
        emit Withdraw(recipient, amount);
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
    }

    /// @notice Receive fee from user in currency units.
    /// @param fee The fee amount to receive in currency units.
    function receiveFeeInternal(uint256 fee) internal {
        if (currency.balanceOf(msg.sender) < fee) {
            revert PawnBots__InsufficientCurrencySent();
        }
        currency.transferFrom(msg.sender, address(this), fee);
    }
}
