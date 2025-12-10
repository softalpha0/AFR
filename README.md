# AFR Savings Vault  
*A simple USD savings vault powered by AFR, starting on Base testnet.*

AFR is a, transparent, smart-contract–powered savings vault built to help people preserve value in a stable USD-denominated asset, starting with the AFR ecosystem.

This repository contains the **smart contracts**, **frontend dApp**, and **roadmap** for AFR.

# Vision

Many regions experience unstable financial systems and rising inflation. Stablecoins and on-chain finance give people a way to store value. But most existing DeFi apps are complex, risky, and not user-friendly.

**AFR clears this with one simple flow:**

1. Deposit USD-stable tokens  
2. Receive aSHARE vault tokens  
3. Withdraw anytime. no lockups  
4. As the vault grows, each share becomes redeemable for more USD

Today AFR is a **testnet prototype on Base Sepolia**, using **mock USDC (mUSDC)**.  
Tomorrow: AFR mainnet, an AFR app-chain rollup, and eventually a standalone L1 if necessary.


# Architecture Overview

**Smart Contract — `SavingsVault.sol`**
- Accepts stablecoin deposits (mUSDC on testnet)
- Mints proportional vault shares (`aSHARE`)
- Handles withdrawals
- Supports simulated yield via owner deposits
- Fully on-chain accounting (no oracles)

**Frontend dApp**
- Built with **Next.js**, **RainbowKit**, **Wagmi v3**, **Tailwind CSS**
- Allows users to:
  - Connect wallet
  - Claim test mUSDC (coming soon)
  - Deposit into the vault
  - Withdraw shares
  - View balances & live share price

 **Contracts**
- **Vault Address:** `0x...` (Base Sepolia)
- **mUSDC Address:** `0x...` (Mock USDC)

