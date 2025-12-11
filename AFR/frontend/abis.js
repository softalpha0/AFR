
export const mockUsdcAbi = [
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "approve",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "transfer",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  }
];



export const vaultAbi = [
  {
    "type": "function",
    "name": "deposit",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "assets", "type": "uint256" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "withdraw",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "shares", "type": "uint256" }],
    "outputs": []
  },

  
  {
    "type": "function",
    "name": "totalAssets",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "totalShares",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  }
];



export const faucetAbi = [
  {
    "type": "function",
    "name": "drip",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "to", "type": "address" }],
    "outputs": []
  }
];