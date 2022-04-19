// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import { VRFConsumerBase } from "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { ERC721A } from "erc721a/contracts/ERC721A.sol";

import { IPawnBots } from "./IPawnBots.sol";

error PawnBots__InsufficientFundsSent();
error PawnBots__MaxPrivatePerAccountExceeded();
error PawnBots__MaxPublicPerTxExceeded();
error PawnBots__NonexistentToken();
error PawnBots__OffsetAlreadySet();
error PawnBots__RandomnessAlreadyRequested();
error PawnBots__RemainingReserveExceeded();
error PawnBots__RemainingSaleExceeded();
error PawnBots__SaleNotActive();
error PawnBots__SaleNotPaused();
error PawnBots__SalePhaseMismatch();
error PawnBots__TooEarlyToReveal();
error PawnBots__UserNotEligible();
error PawnBots__VrfRequestIdMismatch();

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;C1.;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;,G8t;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Gt.;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;L:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;i:;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;,t;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,,,,,,,,iiifffffLLLLLLGCLL;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;.f;;;,C0888888800000000000000000000GGGGGGGGCCCCCCCLLLLLCCCf;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;.f.;;LGG0GGCLLLLLLLLLLfLLfffffttt11iiiiiiiiiiiiiiiiiiiiiLCf.;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;f,;;CLCGGC1i1111ttttttt1111111iiiiiiiiiiiiii11iiiiiiiiitCf.;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;t,;LLLCGGCi;;;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii1LL.;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;t,;CLLCGGCi;iiiiiiiiiiiiiiiiiiiiiiiiiii;iiiiiiiiiiiiiiiiLL,;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;1itLLLLGGCi;ii;iiiiiiiii;;iiiiiiiiiiiii;iiiiiiiiii;iiiiiLL,;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;LfLLLLGGCi;ii;;;iiiiiiiii;;ii;iiiiiiiiii;iii;;;ii;i;ii:if:;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;.:1f1tLLLCCC1;i;;;;iiiiii::1:,;i;iiiiiii;;;;;;;;;;i;;;...;;i;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;.::1LL;1LLCCC1;;;;;;ii;;i;.;;;;,;;;iiiii;;i;;;;;;;;;;;;.;;;;;i;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;,:,;tG1:fLCCC1;;;;;;iiiii;.;;;;.;;;iiii;;i;;;;;;;;;;;;;.;;;;:i;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;,::::11,1LCCCt;;;;;;;;i;;i,;;;;.;;;iiiiiiii;;;;;;;;;iii;::,:ti.;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;,:::,:i,;LLCCt;;;;;;;;;;;i;::::;;;;;;;;i;;;;;;;;;;;;ii;ii;;tL1.;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;,:::,:i,;LLCCf;;;;;;;;;;;;;i;;i;;;;;;;;;iiii;ii1i;;;;;;iii;1fi;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;.::::i1.;LLCCf;;;;;;;;;;;;;;;;;;;;;;;;;i1111i1111;;;;;;;i;;1fi;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;::,:1;.ifLCCf;;;;;;;;;;;;;;;;;;iiiiiiii11111111iiiiiiii;;;1f1;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;i1i;i:;tfLCCL;;;;;;;iiiiiiiiiiiiiiiiiiii11111iiiiiiiiiiii;tf1;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;f1i;iitfLCCLi;iiiiii11111111i1iiiiiiiiiiiiiiiiiiiii11111tfft;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;:f1i;i1tffCLCfiiiiiiiiiiiiii111111111111111ttttttttt1tt1t1fft;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;.1ft111tffLLLCLLfftttttttttttttttttfffffffffffLLffLL11titiffi;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;.:i11tfffLLLLLLLLLLLLLLLffffffffffffffttttt1111iiii;;;:::,.;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;.,:;itLLffffttt111ii1111iiii;,......;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;......;;;;;;;.,,:::::::,,,,,,,:::::::,,..;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;,,,,,,,,,:::::::::::::::::;;;;;;::::;;;;iii11111111i;.;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;,fLLLfft1ii;;;;;;iiiiiiii1111i;11;11;tLLLLLLLLLLLLLLLLLf,;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;ffffLLCCLLLLLLLLLLLLLCCCCCCCLiiLiiLiiLLLLLCLLLLLLLLLLfLi;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;.:tLLftLLLLGGGGGCCLLCCCCCCCLLLLC1,f1,fi:fLLLftttt11ttttfLL1;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;L088800GLCLLCCCCC:;;:CLCCCCCLLLLCt,1t,1t,tCLLLffffLCCLLLLLLt.;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;.L88888880GCCLLCCCCGi.,;CCCCCCCCCCCCf:iL:if,iCLLCCCCCCCLLLLLLLf,;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;.f0GG00000GGCLLLCCCCCCCCCCCCCCCCCCCCCC;:L;:L;:LCCCCCCCCLLLLLLLLL:;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;:LCCCGGGGCCCLLLLLCCCCCCCCCCCCCCCCCCCCC1,f1,f1,fCCCCCCCCCCCCLLLLLi;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;,fLLLLCCLLLLffLLLCCCGCCCCCCCCCCCCCCCCCf,tf,tf,tCCCCCCCCCCCCCLLLLt;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;fffLLLLLLfffLLLCCCGGCCCCCCCCCCCCCCCCL:iL:;L:iCCCCCCCCCCCCCLLLLf.;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;fffffLLLLLffLLLLCCCGCCCCCCCCCCCCCCCCC;,L;,L;:LCCCCCCCCCCCCLLLLf,;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;tGCCLLfffftitLLLLCCCCCCGCCCCCCCCCCCCCG1.ft.t1.tCCCCCCCCCCCLLLLLf:;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

/// @title PawnBots
/// @author Hifi
/// @notice Manages the mint and distribution of the Pawn Bots collection NFTs.
contract PawnBots is IPawnBots, ERC721A, Ownable, ReentrancyGuard, VRFConsumerBase {
    using Strings for uint256;

    /// PUBLIC STORAGE ///

    // TODO: finalize constant values
    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The token reserve allocated for contract owner.
    uint256 public constant RESERVE_CAP = 1_000;

    /// @inheritdoc IPawnBots
    uint256 public override maxPrivatePerAccount;

    /// @inheritdoc IPawnBots
    uint256 public override maxPublicPerTx;

    /// @inheritdoc IPawnBots
    uint256 public override offset;

    /// @inheritdoc IPawnBots
    uint256 public override price;

    /// @inheritdoc IPawnBots
    mapping(address => uint256) public override privateMinted;

    /// @inheritdoc IPawnBots
    string public override provenanceHash;

    /// @inheritdoc IPawnBots
    uint256 public override reserveMinted;

    /// @inheritdoc IPawnBots
    uint256 public override revealTime;

    /// @inheritdoc IPawnBots
    bool public override saleActive;

    /// @inheritdoc IPawnBots
    uint256 public override saleCap;

    /// @inheritdoc IPawnBots
    SalePhase public override salePhase;

    /// INTERNAL STORAGE ///

    /// @dev The base token URI.
    string internal baseURI;

    /// @dev The merkle root of private phase allow list.
    bytes32 internal merkleRoot;

    /// @dev The Chainlink VRF fee in LINK.
    uint256 internal immutable vrfFee;

    /// @dev The Chainlink VRF key hash.
    bytes32 internal immutable vrfKeyHash;

    /// @dev The Chainlink VRF request ID.
    bytes32 internal vrfRequestId;

    constructor(
        address chainlinkToken_,
        bytes32 merkleRoot_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) ERC721A("Pawn Bots", "BOTS") VRFConsumerBase(vrfCoordinator_, chainlinkToken_) {
        merkleRoot = merkleRoot_;

        // TODO: finalize initial price value
        price = 0.02 ether;
        saleCap = COLLECTION_SIZE - RESERVE_CAP;

        vrfFee = vrfFee_;
        vrfKeyHash = vrfKeyHash_;
    }

    /// PUBLIC CONSTANT FUNCTIONS ///

    /// @dev See {ERC721A-tokenURI}.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert PawnBots__NonexistentToken();
        }
        string memory mBaseURI = _baseURI();
        uint256 mOffset = offset;
        if (mOffset == 0) {
            // TODO: live-test possible issues with multiple token IDs
            return bytes(mBaseURI).length > 0 ? string(abi.encodePacked(mBaseURI, "box", ".json")) : "";
        } else {
            uint256 moddedId = (tokenId + mOffset) % COLLECTION_SIZE;
            return bytes(mBaseURI).length > 0 ? string(abi.encodePacked(mBaseURI, moddedId.toString(), ".json")) : "";
        }
    }

    /// PUBLIC NON-CONSTANT FUNCTIONS ///

    /// @inheritdoc IPawnBots
    function burnUnsold(uint256 burnAmount) external override onlyOwner {
        if (saleActive) {
            revert PawnBots__SaleNotPaused();
        }
        if (burnAmount + totalSupply() > saleCap + reserveMinted) {
            revert PawnBots__RemainingSaleExceeded();
        }

        unchecked {
            saleCap -= burnAmount;
        }
        emit BurnUnsold(burnAmount);
    }

    /// @inheritdoc IPawnBots
    function mintPrivate(uint256 mintAmount, bytes32[] calldata merkleProof) external payable override nonReentrant {
        uint256 mPrice = price;
        if (!saleActive) {
            revert PawnBots__SaleNotActive();
        }
        if (salePhase != SalePhase.PRIVATE) {
            revert PawnBots__SalePhaseMismatch();
        }
        if (!MerkleProof.verify(merkleProof, merkleRoot, keccak256(abi.encodePacked(msg.sender)))) {
            revert PawnBots__UserNotEligible();
        }
        if (mintAmount + privateMinted[msg.sender] > maxPrivatePerAccount) {
            revert PawnBots__MaxPrivatePerAccountExceeded();
        }
        if (mintAmount + totalSupply() > saleCap + reserveMinted) {
            revert PawnBots__RemainingSaleExceeded();
        }
        uint256 mintCost;
        unchecked {
            mintCost = mPrice * mintAmount;
        }
        if (msg.value < mintCost) {
            revert PawnBots__InsufficientFundsSent();
        }

        unchecked {
            privateMinted[msg.sender] += mintAmount;
        }

        if (msg.value != mintCost) {
            Address.sendValue(payable(msg.sender), msg.value - mintCost);
        }
        _safeMint(msg.sender, mintAmount);
        emit Mint(msg.sender, mintAmount, mPrice, SalePhase.PRIVATE);
    }

    /// @inheritdoc IPawnBots
    function mintPublic(uint256 mintAmount) external payable override nonReentrant {
        uint256 mPrice = price;
        if (!saleActive) {
            revert PawnBots__SaleNotActive();
        }
        if (salePhase != SalePhase.PUBLIC) {
            revert PawnBots__SalePhaseMismatch();
        }
        if (mintAmount > maxPublicPerTx) {
            revert PawnBots__MaxPublicPerTxExceeded();
        }
        if (mintAmount + totalSupply() > saleCap + reserveMinted) {
            revert PawnBots__RemainingSaleExceeded();
        }
        uint256 mintCost;
        unchecked {
            mintCost = mPrice * mintAmount;
        }
        if (msg.value < mintCost) {
            revert PawnBots__InsufficientFundsSent();
        }

        if (msg.value != mintCost) {
            Address.sendValue(payable(msg.sender), msg.value - mintCost);
        }
        _safeMint(msg.sender, mintAmount);
        emit Mint(msg.sender, mintAmount, mPrice, SalePhase.PUBLIC);
    }

    /// @inheritdoc IPawnBots
    function reserve(uint256 reserveAmount) external override onlyOwner nonReentrant {
        if (reserveAmount + reserveMinted > RESERVE_CAP) {
            revert PawnBots__RemainingReserveExceeded();
        }

        unchecked {
            reserveMinted += reserveAmount;
        }

        _safeMint(msg.sender, reserveAmount);
        emit Reserve(reserveAmount);
    }

    /// @inheritdoc IPawnBots
    function reveal() external override onlyOwner {
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
    function setBaseURI(string calldata newBaseURI) external override onlyOwner {
        baseURI = newBaseURI;
        emit SetBaseURI(newBaseURI);
    }

    /// @inheritdoc IPawnBots
    function setMaxPrivatePerAccount(uint256 newMaxPrivatePerAccount) external override onlyOwner {
        maxPrivatePerAccount = newMaxPrivatePerAccount;
        emit SetMaxPrivatePerAccount(newMaxPrivatePerAccount);
    }

    /// @inheritdoc IPawnBots
    function setMaxPublicPerTx(uint256 newMaxPublicPerTx) external override onlyOwner {
        maxPublicPerTx = newMaxPublicPerTx;
        emit SetMaxPublicPerTx(newMaxPublicPerTx);
    }

    /// @inheritdoc IPawnBots
    function setMerkleRoot(bytes32 newMerkleRoot) external override onlyOwner {
        merkleRoot = newMerkleRoot;
        emit SetMerkleRoot(newMerkleRoot);
    }

    /// @inheritdoc IPawnBots
    function setPrice(uint256 newPrice) external override onlyOwner {
        price = newPrice;
        emit SetPrice(newPrice);
    }

    /// @inheritdoc IPawnBots
    function setProvenanceHash(string calldata newProvenanceHash) external override onlyOwner {
        provenanceHash = newProvenanceHash;
        emit SetProvenanceHash(newProvenanceHash);
    }

    /// @inheritdoc IPawnBots
    function setRevealTime(uint256 newRevealTime) external override onlyOwner {
        revealTime = newRevealTime;
        emit SetRevealTime(newRevealTime);
    }

    /// @inheritdoc IPawnBots
    function setSaleActive(bool newSaleActive) external override onlyOwner {
        saleActive = newSaleActive;
        emit SetSaleActive(newSaleActive);
    }

    /// @inheritdoc IPawnBots
    function setSalePhase(SalePhase newSalePhase) external override onlyOwner {
        salePhase = newSalePhase;
        emit SetSalePhase(newSalePhase);
    }

    /// @inheritdoc IPawnBots
    function withdraw(uint256 withdrawAmount) external override onlyOwner {
        Address.sendValue(payable(owner()), withdrawAmount);
        emit Withdraw(withdrawAmount);
    }

    /// @inheritdoc IPawnBots
    function withdrawErc20(address token, uint256 withdrawAmount) external override onlyOwner {
        IERC20(token).transfer(owner(), withdrawAmount);
        emit WithdrawErc20(token, withdrawAmount);
    }

    /// INTERNAL CONSTANT FUNCTIONS ///

    /// @dev See {ERC721A-_baseURI}.
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

        unchecked {
            offset = (randomness % (COLLECTION_SIZE - 1)) + 1;
        }
        emit Reveal();
    }
}
