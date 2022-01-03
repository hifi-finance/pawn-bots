// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";
import "./IBotFarmFrens.sol";

error BFF__EligibilityExceededForPrivatePhase();
error BFF__InsufficientCurrencySent();
error BFF__MaxElementsExceeded();
error BFF__MaxMintsPerTxExceededForPublicPhase();
error BFF__NonexistentToken();
error BFF__NotWhitelistedForPrivatePhase();
error BFF__OffsetAlreadySet();
error BFF__RandomnessAlreadyRequested();
error BFF__SaleIsActive();
error BFF__SaleIsNotActive();
error BFF__VrfRequestIdMismatch();

/// @title BotFarmFrens
/// @author Hifi
/// @notice Manages the mint and distribution of BFFs.
contract BotFarmFrens is IBotFarmFrens, ERC721Enumerable, Ownable, ReentrancyGuard, VRFConsumerBase {
    using Strings for uint256;

    /// STRUCTS ///

    struct WhitelistElement {
        bool exists;
        uint256 claimedAmount;
        uint256 eligibleAmount;
    }

    /// PUBLIC STORAGE ///

    /// @inheritdoc IBotFarmFrens
    uint256 public override offset;

    /// @inheritdoc IBotFarmFrens
    IERC20Metadata public override currency;

    /// @inheritdoc IBotFarmFrens
    uint256 public override maxElements = COLLECTION_SIZE;

    /// @inheritdoc IBotFarmFrens
    uint256 public override maxPublicPerTx;

    /// @inheritdoc IBotFarmFrens
    uint256 public override price;

    /// @inheritdoc IBotFarmFrens
    string public override provenanceHash;

    /// @inheritdoc IBotFarmFrens
    uint256 public override saleStartTime;

    /// @inheritdoc IBotFarmFrens
    bool public override saleIsActive;

    /// @inheritdoc IBotFarmFrens
    mapping(address => WhitelistElement) public override whitelist;

    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The private sale duration from the sale start timestamp.
    uint256 public constant PRIVATE_SALE_DURATION = 24 hours;

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
    ) ERC721("Bot Farm Frens", "BFF") VRFConsumerBase(vrfCoordinator_, chainlinkToken_) {
        currency = currency_;
        vrfFee = vrfFee_;
        vrfKeyHash = vrfKeyHash_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @dev See {ERC721-tokenURI}.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert BFF__NonexistentToken();
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

    /// @inheritdoc IBotFarmFrens
    function burnUnsold(uint256 burnAmount) public override onlyOwner {
        if (saleIsActive) {
            revert BFF__SaleIsActive();
        }
        if (burnAmount + totalSupply() > maxElements) {
            revert BFF__MaxElementsExceeded();
        }

        maxElements -= burnAmount;
        emit BurnUnsold(burnAmount);
    }

    /// @inheritdoc IBotFarmFrens
    function mintBFF(uint256 mintAmount) public override nonReentrant {
        if (!saleIsActive) {
            revert BFF__SaleIsNotActive();
        }
        if (mintAmount + totalSupply() > maxElements) {
            revert BFF__MaxElementsExceeded();
        }
        if (block.timestamp <= saleStartTime + PRIVATE_SALE_DURATION) {
            // private phase
            if (!whitelist[msg.sender].exists) {
                revert BFF__NotWhitelistedForPrivatePhase();
            }
            if (mintAmount > whitelist[msg.sender].eligibleAmount - whitelist[msg.sender].claimedAmount) {
                revert BFF__EligibilityExceededForPrivatePhase();
            }
            whitelist[msg.sender].claimedAmount += mintAmount;
        } else {
            // public phase
            if (mintAmount > maxPublicPerTx) {
                revert BFF__MaxMintsPerTxExceededForPublicPhase();
            }
        }

        uint256 fee = price * mintAmount;
        receiveFeeInternal(fee);
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply();
            _safeMint(msg.sender, mintId);
        }
        emit MintBFF(msg.sender, mintAmount, fee);
    }

    /// @inheritdoc IBotFarmFrens
    function pauseSale() public override onlyOwner {
        if (!saleIsActive) {
            revert BFF__SaleIsNotActive();
        }

        saleIsActive = false;
        emit PauseSale();
    }

    /// @inheritdoc IBotFarmFrens
    function reserve(uint256 reserveAmount) public override onlyOwner {
        uint256 totalSupply = totalSupply();
        if (reserveAmount + totalSupply > maxElements) {
            revert BFF__MaxElementsExceeded();
        }

        for (uint256 i = 0; i < reserveAmount; i++) {
            _safeMint(msg.sender, totalSupply + i);
        }
        emit Reserve(reserveAmount);
    }

    /// @inheritdoc IBotFarmFrens
    function reveal() public override onlyOwner {
        if (offset != 0) {
            revert BFF__OffsetAlreadySet();
        }
        if (vrfRequestId != 0) {
            revert BFF__RandomnessAlreadyRequested();
        }

        vrfRequestId = requestRandomness(vrfKeyHash, vrfFee);
        emit Reveal();
    }

    /// @inheritdoc IBotFarmFrens
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        string memory oldBaseURI = baseURI;
        baseURI = newBaseURI;
        emit SetBaseURI(oldBaseURI, baseURI);
    }

    /// @inheritdoc IBotFarmFrens
    function setMaxPublicPerTx(uint256 newMaxPublicPerTx) public override onlyOwner {
        uint256 oldMaxPublicPerTx = maxPublicPerTx;
        maxPublicPerTx = newMaxPublicPerTx;
        emit SetMaxPublicPerTx(oldMaxPublicPerTx, maxPublicPerTx);
    }

    /// @inheritdoc IBotFarmFrens
    function setPrice(uint256 newPrice) public override onlyOwner {
        uint256 oldPrice = price;
        price = newPrice;
        emit SetPrice(oldPrice, price);
    }

    /// @inheritdoc IBotFarmFrens
    function setProvenanceHash(string memory newProvenanceHash) public override onlyOwner {
        string memory oldProvenanceHash = provenanceHash;
        provenanceHash = newProvenanceHash;
        emit SetProvenanceHash(oldProvenanceHash, provenanceHash);
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
        if (saleIsActive) {
            revert BFF__SaleIsActive();
        }
        saleStartTime = block.timestamp;
        saleIsActive = true;
        emit StartSale();
    }

    /// @inheritdoc IBotFarmFrens
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
            revert BFF__OffsetAlreadySet();
        }
        if (vrfRequestId != requestId) {
            revert BFF__VrfRequestIdMismatch();
        }
        offset = (randomness % (COLLECTION_SIZE - 1)) + 1;
    }

    /// @notice Receive fee from user in currency units.
    /// @param fee The fee amount to receive in currency units.
    function receiveFeeInternal(uint256 fee) internal {
        if (currency.balanceOf(msg.sender) < fee) {
            revert BFF__InsufficientCurrencySent();
        }
        currency.transferFrom(msg.sender, address(this), fee);
    }
}
