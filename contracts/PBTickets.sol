// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./IPBTickets.sol";

error PBTickets__InsufficientFunds();
error PBTickets__InvalidRecipient();
error PBTickets__MaxPrivateMintsExceeded();
error PBTickets__MaxPublicMintsPerTxExceeded();
error PBTickets__MintNotAuthorized();
error PBTickets__NonexistentToken();
error PBTickets__PrivatePhaseExpired();
error PBTickets__PublicPhaseNotStarted();
error PBTickets__SaleAlreadyStarted();
error PBTickets__SaleCapExceeded();
error PBTickets__SaleNotStarted();

/// @title PBTickets
/// @author Hifi
/// @notice Manages the mint and distribution of sale ticket NFTs.
contract PBTickets is IPBTickets, ERC721Enumerable, ERC721Pausable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    /// PUBLIC STORAGE ///

    /// @dev The number of tickets on sale.
    uint256 public constant MAX_TICKETS = 9_000;

    /// @dev The private sale duration from the sale start timestamp.
    uint256 public constant PRIVATE_DURATION = 24 hours;

    /// @inheritdoc IPBTickets
    mapping(address => uint256) public override claimedPrivateMints;

    /// @inheritdoc IPBTickets
    uint256 public override maxPrivateMints;

    /// @inheritdoc IPBTickets
    uint256 public override maxPublicMintsPerTx;

    /// @inheritdoc IPBTickets
    uint256 public override price;

    /// @inheritdoc IPBTickets
    uint256 public override saleCap = MAX_TICKETS;

    /// @inheritdoc IPBTickets
    uint256 public override saleStartTime;

    /// INTERNAL STORAGE ///

    /// @dev The base token URI.
    string internal baseURI;

    /// @dev The merkle root of addresses eligible to mint in the private phase.
    bytes32 internal merkleRoot;

    constructor(bytes32 merkleRoot_) ERC721("Pawn Bots Mint Tickets", "PBTKT") {
        merkleRoot = merkleRoot_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

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
    function burnUnsold(uint256 burnAmount) public override onlyOwner whenPaused {
        if (burnAmount + totalSupply() > saleCap) {
            revert PBTickets__SaleCapExceeded();
        }
        saleCap -= burnAmount;
        emit BurnUnsold(burnAmount);
    }

    /// @inheritdoc IPBTickets
    function mintPrivate(uint256 mintAmount, bytes32[] calldata merkleProof)
        public
        payable
        override
        nonReentrant
        whenNotPaused
    {
        if (saleStartTime == 0) {
            revert PBTickets__SaleNotStarted();
        }
        if (block.timestamp > saleStartTime + PRIVATE_DURATION) {
            revert PBTickets__PrivatePhaseExpired();
        }
        if (!MerkleProof.verify(merkleProof, merkleRoot, keccak256(abi.encodePacked(msg.sender)))) {
            revert PBTickets__MintNotAuthorized();
        }
        if (mintAmount + claimedPrivateMints[msg.sender] > maxPrivateMints) {
            revert PBTickets__MaxPrivateMintsExceeded();
        }
        claimedPrivateMints[msg.sender] += mintAmount;
        mintInternal(mintAmount);
        emit Mint(msg.sender, mintAmount, price, MintPhase.PRIVATE);
    }

    /// @inheritdoc IPBTickets
    function mintPublic(uint256 mintAmount) public payable override nonReentrant whenNotPaused {
        if (saleStartTime == 0) {
            revert PBTickets__SaleNotStarted();
        }
        if (block.timestamp <= saleStartTime + PRIVATE_DURATION) {
            revert PBTickets__PublicPhaseNotStarted();
        }
        if (mintAmount > maxPublicMintsPerTx) {
            revert PBTickets__MaxPublicMintsPerTxExceeded();
        }
        mintInternal(mintAmount);
        emit Mint(msg.sender, mintAmount, price, MintPhase.PUBLIC);
    }

    /// @inheritdoc IPBTickets
    function pauseTickets(bool state) public override onlyOwner {
        if (state) {
            _pause();
        } else {
            _unpause();
        }
        emit PauseTickets(state);
    }

    /// @inheritdoc IPBTickets
    function setBaseURI(string memory newBaseURI) public override onlyOwner {
        baseURI = newBaseURI;
        emit SetBaseURI(newBaseURI);
    }

    /// @inheritdoc IPBTickets
    function setMaxPrivateMints(uint256 newMaxPrivateMints) public override onlyOwner {
        maxPrivateMints = newMaxPrivateMints;
        emit SetMaxPrivateMints(maxPrivateMints);
    }

    /// @inheritdoc IPBTickets
    function setMaxPublicMintsPerTx(uint256 newMaxPublicMintsPerTx) public override onlyOwner {
        maxPublicMintsPerTx = newMaxPublicMintsPerTx;
        emit SetMaxPublicMintsPerTx(maxPublicMintsPerTx);
    }

    /// @inheritdoc IPBTickets
    function setPrice(uint256 newPrice) public override onlyOwner {
        price = newPrice;
        emit SetPrice(price);
    }

    /// @inheritdoc IPBTickets
    function startSale() public override onlyOwner {
        if (saleStartTime != 0) {
            revert PBTickets__SaleAlreadyStarted();
        }
        saleStartTime = block.timestamp;
        emit StartSale();
    }

    /// @inheritdoc IPBTickets
    function withdraw(address recipient) public override onlyOwner {
        if (recipient == address(0)) {
            revert PBTickets__InvalidRecipient();
        }
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
        return super.supportsInterface(interfaceId);
    }

    /// INTERNAL NON-CONSTANT FUNCTIONS ///

    /// @dev See {ERC721-_beforeTokenTransfer}.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev Mint ticket NFTs in exchange for fees.
    function mintInternal(uint256 mintAmount) internal {
        uint256 totalSupply = totalSupply();
        if (mintAmount + totalSupply > saleCap) {
            revert PBTickets__SaleCapExceeded();
        }
        uint256 mintCost = price * mintAmount;
        if (msg.value < mintCost) {
            revert PBTickets__InsufficientFunds();
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
