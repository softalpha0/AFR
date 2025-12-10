import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";

import { MUSDC_ADDRESS, VAULT_ADDRESS } from "../addresses";
import { mockUsdcAbi, vaultAbi } from "../abis";

const MUSDC_DECIMALS = 6;
const SHARE_DECIMALS = 18;


const compactNumber = (num) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 3,
  }).format(num);

const displayUsdc = (val, fractionDigits = 6) => {
  if (!val) return "0.00";
  const num = Number(formatUnits(val, MUSDC_DECIMALS));

  
  if (num >= 1000000) return compactNumber(num);

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  });
};

const displayShares = (val, fractionDigits = 6) => {
  if (!val) return "0.00";
  const num = Number(formatUnits(val, SHARE_DECIMALS));

  if (num >= 1000000) return compactNumber(num);

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  });
};

export default function Home() {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  // ---- READS ----
  const { data: mUsdcBalance } = useReadContract({
    address: MUSDC_ADDRESS,
    abi: mockUsdcAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: shareBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "totalAssets",
    args: [],
  });

  const { data: totalShares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "totalShares",
    args: [],
  });

  
  const positionValue =
    shareBalance && totalAssets && totalShares && totalShares > 0n
      ? (shareBalance * totalAssets) / totalShares
      : 0n;

  
  const sharePrice =
    totalAssets && totalShares && totalShares > 0n
      ? Number(
          
          formatUnits(
            (totalAssets * 10n ** 18n) / totalShares,
            MUSDC_DECIMALS
          )
        )
      : 1;

  
  const handleDeposit = async () => {
    if (!address || !depositAmount) return;

    try {
      const amount = parseUnits(depositAmount, MUSDC_DECIMALS);

      
      const approveHash = await writeContractAsync({
        address: MUSDC_ADDRESS,
        abi: mockUsdcAbi,
        functionName: "approve",
        args: [VAULT_ADDRESS, amount],
      });
      console.log("approve tx:", approveHash);

      
      const depositHash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "deposit",
        args: [amount],
      });
      console.log("deposit tx:", depositHash);

      setDepositAmount("");
    } catch (err) {
      console.error(err);
      alert(err?.shortMessage || err?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!address || !withdrawShares) return;
    try {
      const shares = parseUnits(withdrawShares, SHARE_DECIMALS);

      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: "withdraw",
        args: [shares],
      });
      console.log("withdraw tx:", hash);

      setWithdrawShares("");
    } catch (err) {
      console.error(err);
      alert(err?.shortMessage || err?.message || "Withdraw failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05060b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 600 }}>
          AFR Savings Vault
        </h1>
        <ConnectButton />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left: balances & actions */}
        <div
          style={{
            background: "#0c0f1a",
            borderRadius: "16px",
            padding: "1.5rem",
            border: "1px solid #1e2235",
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
            Your position
          </h2>

          {!address && (
            <p style={{ opacity: 0.8 }}>Connect your wallet to view balances.</p>
          )}

          {address && (
            <>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>Wallet</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    mUSDC balance
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {displayUsdc(mUsdcBalance, 6)} mUSDC
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    Vault shares
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {displayShares(shareBalance, 6)} aSHARE
                  </div>
                </div>
              </div>

              {/* Position value */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  Vault position value
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  {displayUsdc(positionValue, 6)} mUSDC
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Deposit */}
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.8,
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Deposit mUSDC
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        flex: 1,
                        padding: "0.6rem 0.75rem",
                        borderRadius: "10px",
                        border: "1px solid #262a40",
                        background: "#05060b",
                        color: "white",
                      }}
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={isPending || !address}
                      style={{
                        padding: "0.6rem 1.2rem",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          isPending || !address ? "#33384f" : "#3b82f6",
                        color: "white",
                        fontWeight: 600,
                        cursor: isPending || !address ? "not-allowed" : "pointer",
                      }}
                    >
                      {isPending ? "Submitting..." : "Deposit"}
                    </button>
                  </div>
                </div>

                {/* Withdraw */}
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.8,
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Withdraw (in shares)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      value={withdrawShares}
                      onChange={(e) => setWithdrawShares(e.target.value)}
                      placeholder="0.00"
                      style={{
                        flex: 1,
                        padding: "0.6rem 0.75rem",
                        borderRadius: "10px",
                        border: "1px solid #262a40",
                        background: "#05060b",
                        color: "white",
                      }}
                    />
                    <button
                      onClick={handleWithdraw}
                      disabled={isPending || !address}
                      style={{
                        padding: "0.6rem 1.2rem",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          isPending || !address ? "#33384f" : "#f97316",
                        color: "white",
                        fontWeight: 600,
                        cursor: isPending || !address ? "not-allowed" : "pointer",
                      }}
                    >
                      {isPending ? "Submitting..." : "Withdraw"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: vault stats */}
        <div
          style={{
            background: "#0c0f1a",
            borderRadius: "16px",
            padding: "1.5rem",
            border: "1px solid #1e2235",
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
            Vault stats
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <StatRow
              label="Total assets"
              value={`${displayUsdc(totalAssets, 6)} mUSDC`}
            />
            <StatRow
              label="Total shares"
              value={`${displayShares(totalShares, 6)} aSHARE`}
            />
            <StatRow
              label="Implied share price"
              value={`${sharePrice.toFixed(8)} mUSDC per share`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9rem",
      }}
    >
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}