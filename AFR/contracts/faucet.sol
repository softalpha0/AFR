
pragma solidity ^0.8.20;


interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}


abstract contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}


contract Faucet is Ownable {
    IERC20 public immutable token;
    uint256 public constant FAUCET_AMOUNT = 100 * 1e6; 
    uint256 public constant COOLDOWN = 1 hours;

    mapping(address => uint256) public lastClaim;

    event Claimed(address indexed user, uint256 amount);

    constructor(address _token) {
        require(_token != address(0), "token addr zero");
        token = IERC20(_token);
    }

    function claim() external {
        uint256 last = lastClaim[msg.sender];
        require(block.timestamp - last >= COOLDOWN, "wait before next claim");

        require(
            token.balanceOf(address(this)) >= FAUCET_AMOUNT,
            "faucet empty"
        );

        lastClaim[msg.sender] = block.timestamp;

        require(token.transfer(msg.sender, FAUCET_AMOUNT), "transfer failed");

        emit Claimed(msg.sender, FAUCET_AMOUNT);
    }

    
    function withdraw(uint256 amount, address to) external onlyOwner {
        require(to != address(0), "zero addr");
        require(token.transfer(to, amount), "withdraw transfer failed");
    }
}