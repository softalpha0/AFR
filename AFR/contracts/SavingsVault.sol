
pragma solidity ^0.8.20;


interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
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


contract SavingsVault is Ownable {
    IERC20 public immutable asset; 
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    uint256 public totalShares;
    mapping(address => uint256) public balanceOf;

    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);
    event YieldInjected(address indexed from, uint256 amount, uint256 newTotalAssets);

    constructor(address _asset, string memory _name, string memory _symbol) {
        require(_asset != address(0), "asset addr zero");
        asset = IERC20(_asset);
        name = _name;
        symbol = _symbol;
        
    }

    
    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

   
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 _totalShares = totalShares;
        uint256 _totalAssets = totalAssets();

        if (_totalShares == 0 || _totalAssets == 0) {
            
            return assets * 1e18;
        } else {
            
            return (assets * _totalShares) / _totalAssets;
        }
    }

    
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 _totalShares = totalShares;
        uint256 _totalAssets = totalAssets();
        if (_totalShares == 0) return 0;
        
        return (shares * _totalAssets) / _totalShares;
    }

    
    function deposit(uint256 assets) external returns (uint256 shares) {
        require(assets > 0, "zero assets");

        shares = convertToShares(assets);
        require(shares > 0, "zero shares");

        
        bool ok = asset.transferFrom(msg.sender, address(this), assets);
        require(ok, "transferFrom failed");

        
        totalShares += shares;
        balanceOf[msg.sender] += shares;

        emit Deposit(msg.sender, assets, shares);
    }

    
    function withdraw(uint256 shares) external returns (uint256 assetsOut) {
        require(shares > 0, "zero shares");
        uint256 bal = balanceOf[msg.sender];
        require(bal >= shares, "insufficient shares");

        assetsOut = convertToAssets(shares);
        require(assetsOut > 0, "zero assets");

        
        balanceOf[msg.sender] = bal - shares;
        totalShares -= shares;

        
        bool ok = asset.transfer(msg.sender, assetsOut);
        require(ok, "transfer failed");

        emit Withdraw(msg.sender, assetsOut, shares);
    }

    
    function ownerDepositYield(uint256 amount) external onlyOwner {
        require(amount > 0, "zero amount");

        bool ok = asset.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom failed");

        emit YieldInjected(msg.sender, amount, totalAssets());
    }
}