// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";
import "./IPBTickets.sol";

error PBTickets__InsufficientFundsSent();
error PBTickets__MaxElementsExceeded();
error PBTickets__MaxMintsPerTxExceeded();
error PBTickets__NonexistentToken();
error PBTickets__NotWhitelistedForPrivatePhase();
error PBTickets__PrivatePhaseIsOver();
error PBTickets__PublicPhaseNotYetStarted();
error PBTickets__SaleIsActive();
error PBTickets__SaleIsNotActive();

/// @title PBTickets
/// @author Hifi
/// @notice Manages the mint and distribution of NFTs.
contract PBTickets is IPBTickets, ERC721Enumerable, ERC721Pausable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    /// PUBLIC STORAGE ///

    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The private sale duration from the sale start timestamp.
    uint256 public constant PRIVATE_DURATION = 24 hours;

    /// @inheritdoc IPBTickets
    bool public override isSaleActive;

    /// @inheritdoc IPBTickets
    uint256 public override maxElements = COLLECTION_SIZE;

    /// @inheritdoc IPBTickets
    uint256 public override maxMintsPerTx;

    /// @inheritdoc IPBTickets
    uint256 public override price;

    /// @inheritdoc IPBTickets
    uint256 public override saleStartTime;

    /// INTERNAL STORAGE ///

    /// @dev The base token URI.
    string internal baseURI;

    /// @dev The whitelist merkle root.
    bytes32 internal merkleRoot;

    constructor(bytes32 merkleRoot_) ERC721("Pawn Bots Mint Tickets", "PBTKT") {
        merkleRoot = merkleRoot_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @inheritdoc IPBTickets
    function isWhitelisted(address account, bytes32[] calldata merkleProof) public view override returns (bool) {
        return MerkleProof.verify(merkleProof, merkleRoot, keccak256(abi.encodePacked(account)));
    }

    /// @dev See {ERC721-tokenURI}.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert PBTickets__NonexistentToken();
        }
        string memory bURI = _baseURI();
        return bytes(bURI).length > 0 ? string(abi.encodePacked(bURI, "ticket", ".json")) : "";
    }

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @inheritdoc IPBTickets
    function burnUnsold(uint256 burnAmount) public override onlyOwner {
        if (isSaleActive) {
            revert PBTickets__SaleIsActive();
        }
        if (burnAmount + totalSupply() > maxElements) {
            revert PBTickets__MaxElementsExceeded();
        }

        maxElements -= burnAmount;
        emit BurnUnsold(burnAmount);
    }

    /// @inheritdoc IPBTickets
    function mintPrivate(uint256 mintAmount, bytes32[] calldata merkleProof) public payable override nonReentrant {
        if (!isSaleActive) {
            revert PBTickets__SaleIsNotActive();
        }
        if (block.timestamp > saleStartTime + PRIVATE_DURATION) {
            revert PBTickets__PrivatePhaseIsOver();
        }
        if (!isWhitelisted(msg.sender, merkleProof)) {
            revert PBTickets__NotWhitelistedForPrivatePhase();
        }

        mintInternal(mintAmount);
        emit Mint(msg.sender, mintAmount, price, MintPhase.PRIVATE);
    }

    /// @inheritdoc IPBTickets
    function mintPublic(uint256 mintAmount) public payable override nonReentrant {
        if (!isSaleActive) {
            revert PBTickets__SaleIsNotActive();
        }
        if (block.timestamp <= saleStartTime + PRIVATE_DURATION) {
            revert PBTickets__PublicPhaseNotYetStarted();
        }

        mintInternal(mintAmount);
        emit Mint(msg.sender, mintAmount, price, MintPhase.PUBLIC);
    }

    /// @inheritdoc IPBTickets
    function pauseSale() public override onlyOwner {
        if (!isSaleActive) {
            revert PBTickets__SaleIsNotActive();
        }

        isSaleActive = false;
        emit PauseSale();
    }

    /// @inheritdoc IPBTickets
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        baseURI = newBaseURI;
        emit SetBaseURI(newBaseURI);
    }

    /// @inheritdoc IPBTickets
    function setMaxMintsPerTx(uint256 newMaxMintsPerTx) public override onlyOwner {
        maxMintsPerTx = newMaxMintsPerTx;
        emit SetMaxMintsPerTx(maxMintsPerTx);
    }

    /// @inheritdoc IPBTickets
    function setPrice(uint256 newPrice) public override onlyOwner {
        price = newPrice;
        emit SetPrice(price);
    }

    /// @inheritdoc IPBTickets
    function startSale() public override onlyOwner {
        if (isSaleActive) {
            revert PBTickets__SaleIsActive();
        }
        if (saleStartTime == 0) {
            saleStartTime = block.timestamp;
        }
        isSaleActive = true;
        emit StartSale();
    }

    /// @inheritdoc IPBTickets
    function withdraw(address recipient) public override onlyOwner {
        uint256 amount = address(this).balance;
        Address.sendValue(payable(recipient), amount);
        emit Withdraw(recipient, amount);
    }

    /// INTERNAL CONSTANT FUNCTIONS ///

    /// @dev See {ERC721-_baseURI}.
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return ERC721Enumerable.supportsInterface(interfaceId);
    }

    /// INTERNAL NON-CONSTANT FUNCTIONS ///

    /// @dev See {ERC721-_beforeTokenTransfer}.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable, ERC721Pausable) {
        ERC721Pausable._beforeTokenTransfer(from, to, tokenId);
        ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev Mint NFTs in exchange for fees.
    function mintInternal(uint256 mintAmount) internal {
        if (mintAmount > maxMintsPerTx) {
            revert PBTickets__MaxMintsPerTxExceeded();
        }
        uint256 totalSupply = totalSupply();
        if (mintAmount + totalSupply > maxElements) {
            revert PBTickets__MaxElementsExceeded();
        }

        uint256 mintCost = price * mintAmount;
        if (msg.value < mintCost) {
            revert PBTickets__InsufficientFundsSent();
        }

        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 mintId = totalSupply + i;
            _safeMint(msg.sender, mintId);
        }

        if (msg.value > mintCost) {
            Address.sendValue(payable(msg.sender), msg.value - mintCost);
        }
    }
}
