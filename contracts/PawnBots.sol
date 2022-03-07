// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IPawnBots.sol";

error PawnBots__CollectionSizeExceeded();
error PawnBots__MintIsAlreadyEnabled();
error PawnBots__MintIsNotEnabled();
error PawnBots__NonexistentToken();
error PawnBots__OffsetAlreadySet();
error PawnBots__RandomnessAlreadyRequested();
error PawnBots__ReserveCapExceeded();
error PawnBots__TooEarlyToReveal();
error PawnBots__UserEligibilityExceeded();
error PawnBots__UserIsNotEligible();
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
contract PawnBots is IPawnBots, ERC721Enumerable, Ownable, ReentrancyGuard, VRFConsumerBase {
    using Strings for uint256;

    /// PUBLIC STORAGE ///

    /// @dev The theoretical collection size.
    uint256 public constant COLLECTION_SIZE = 10_000;

    /// @dev The maximum amount of NFTs that can be reserved by the contract owner.
    uint256 public constant RESERVE_CAP = 1_000;

    /// @inheritdoc IPawnBots
    mapping(address => Claim) public override claims;

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

    /// @dev The Chainlink VRF fee in LINK.
    uint256 internal vrfFee;

    /// @dev The Chainlink VRF key hash.
    bytes32 internal vrfKeyHash;

    /// @dev The Chainlink VRF request ID.
    bytes32 internal vrfRequestId;

    constructor(
        address chainlinkToken_,
        address vrfCoordinator_,
        uint256 vrfFee_,
        bytes32 vrfKeyHash_
    ) ERC721("Pawn Bots", "BOTS") VRFConsumerBase(vrfCoordinator_, chainlinkToken_) {
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
    function mint(uint256 mintAmount) public override nonReentrant {
        if (!isMintEnabled) {
            revert PawnBots__MintIsNotEnabled();
        }
        if (mintAmount + totalSupply() > COLLECTION_SIZE) {
            revert PawnBots__CollectionSizeExceeded();
        }
        Claim memory claim = claims[msg.sender];
        if (!claim.exists) {
            revert PawnBots__UserIsNotEligible();
        }
        if (mintAmount + claim.claimedAmount > claim.allocatedAmount) {
            revert PawnBots__UserEligibilityExceeded();
        }
        claims[msg.sender].claimedAmount += mintAmount;
        for (uint256 i = 0; i < mintAmount; i++) {
            _safeMint(msg.sender, totalSupply());
        }
        emit Mint(msg.sender, mintAmount);
    }

    /// @inheritdoc IPawnBots
    function reserve(uint256 reserveAmount) public override onlyOwner {
        if (reserveAmount + reservedElements > RESERVE_CAP) {
            revert PawnBots__ReserveCapExceeded();
        }
        reservedElements += reserveAmount;
        for (uint256 i = 0; i < reserveAmount; i++) {
            _safeMint(msg.sender, totalSupply());
        }
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
    function setClaims(NewClaim[] memory newClaims) public override onlyOwner {
        for (uint256 i = 0; i < newClaims.length; i++) {
            NewClaim memory newClaim = newClaims[i];
            Claim memory claim = claims[newClaim.user];
            claim.exists = true;
            claim.allocatedAmount = newClaim.allocatedAmount;
            claims[newClaim.user] = claim;
        }
        emit SetClaims();
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
