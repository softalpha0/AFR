
import { useState, useMemo } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";

import { MUSDC_ADDRESS, VAULT_ADDRESS, FAUCET_ADDRESS } from "../addresses";
import { mockUsdcAbi, vaultAbi, faucetAbi } from "../abis";

const MUSDC_DECIMALS = 6;
const SHARE_DECIMALS = 6;


const SIMULATED_APR = 0.05;

export default function VaultPage() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const [isFaucetPending, setIsFaucetPending] = useState(false);

  
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

  

  const formatUsdc = (val, { min = 4, max = 6 } = {}) => {
    if (!val) return "0.0000";
    const num = Number(formatUnits(val, MUSDC_DECIMALS));
    return num.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  };

  const formatShares = (val, { min = 4, max = 6 } = {}) => {
    if (!val) return "0.0000";
    const num = Number(formatUnits(val, SHARE_DECIMALS));
    return num.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  };

  const sharePrice = useMemo(() => {
    if (!totalAssets || !totalShares || totalShares === 0n) return 1;

   
    const assetsFloat = Number(formatUnits(totalAssets, MUSDC_DECIMALS));
    const sharesFloat = Number(formatUnits(totalShares, SHARE_DECIMALS));
    if (!sharesFloat) return 1;

    return assetsFloat / sharesFloat;
  }, [totalAssets, totalShares]);

  const positionValue = useMemo(() => {
    if (!shareBalance || !totalAssets || !totalShares || totalShares === 0n) {
      return 0;
    }

    const assetsFloat = Number(formatUnits(totalAssets, MUSDC_DECIMALS));
    const sharesFloat = Number(formatUnits(totalShares, SHARE_DECIMALS));
    const mySharesFloat = Number(formatUnits(shareBalance, SHARE_DECIMALS));
    if (!sharesFloat) return 0;

    const fraction = mySharesFloat / sharesFloat;
    return assetsFloat * fraction;
  }, [shareBalance, totalAssets, totalShares]);

  const demoHistory = useMemo(() => {
    const sp = sharePrice || 1;
    return [1, 1.01, 1.015, 1.03, sp];
  }, [sharePrice]);

  
  const handleGetTestTokens = async () => {
    if (!address) {
      alert("Connect your wallet first.");
      return;
    }

    try {
      setIsFaucetPending(true);

      
      const hash = await writeContractAsync({
        address: FAUCET_ADDRESS,
        abi: faucetAbi,
        functionName: "drip",
        args: [address],
      });

      console.log("faucet tx:", hash);
    } catch (err) {
      console.error(err);
      alert(err?.shortMessage || err?.message || "Faucet transaction failed");
    } finally {
      setIsFaucetPending(false);
    }
  };

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
      className="vault-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(248,113,113,0.35), transparent 55%), #05060b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.5rem 1rem 3.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      
      <header
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 20%, #f97316, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            $
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>
              AFR Savings Vault
            </div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              Base Sepolia testnet • mock mUSDC only
            </div>
          </div>
        </div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <Link
            href="https://github.com/softalpha0/AFR"
            target="_blank"
            style={{ opacity: 0.8 }}
          >
            GitHub
          </Link>

          <button
            onClick={handleGetTestTokens}
            disabled={isFaucetPending || !address}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              border: "none",
              background:
                isFaucetPending || !address ? "#15803d66" : "#22c55e",
              color: "black",
              fontWeight: 600,
              cursor:
                isFaucetPending || !address ? "not-allowed" : "pointer",
              fontSize: "0.8rem",
            }}
          >
            {isFaucetPending ? "Sending..." : "Get test mUSDC"}
          </button>

          <div
            style={{
              padding: "0.25rem 0.4rem",
              borderRadius: "999px",
              background: "#0f172a",
              border: "1px solid #1f2937",
            }}
          >
            <ConnectButton />
          </div>
        </nav>
      </header>

      
      <main
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        
        <section className="vault-card">
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.15rem" }}>
            Your position
          </h2>

          {!address && (
            <p style={{ opacity: 0.8 }}>
              Connect your wallet on Base Sepolia to view balances.
            </p>
          )}

          {address && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Wallet</div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                  }}
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.8rem",
                  marginBottom: "1.1rem",
                }}
              >
                <StatColumn
                  label="mUSDC balance"
                  value={`${formatUsdc(mUsdcBalance, {
                    min: 4,
                    max: 6,
                  })} mUSDC`}
                />
                <StatColumn
                  label="Vault shares"
                  value={`${formatShares(shareBalance, {
                    min: 4,
                    max: 6,
                  })} aSHARE`}
                />
              </div>

              <div
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.9rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(148,163,184,0.4)",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,64,175,0.4))",
                }}
              >
                <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                  Vault position value
                </div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    marginTop: "0.15rem",
                  }}
                >
                  {positionValue.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 6,
                  })}{" "}
                  mUSDC
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    opacity: 0.7,
                    marginTop: "0.25rem",
                  }}
                >
                  Based on live share price × your aSHARE balance.
                </div>
              </div>

              
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                
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
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.8rem",
                        borderRadius: "10px",
                        border: "1px solid #262a40",
                        background: "#05060b",
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={isPending || !address}
                      style={{
                        padding: "0.65rem 1.3rem",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          isPending || !address ? "#4b5563" : "#ec4899",
                        color: "white",
                        fontWeight: 600,
                        cursor:
                          isPending || !address
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      {isPending ? "Submitting..." : "Deposit"}
                    </button>
                  </div>
                </div>

                
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
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      value={withdrawShares}
                      onChange={(e) => setWithdrawShares(e.target.value)}
                      placeholder="0.00"
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.8rem",
                        borderRadius: "10px",
                        border: "1px solid #262a40",
                        background: "#05060b",
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    />
                    <button
                      onClick={handleWithdraw}
                      disabled={isPending || !address}
                      style={{
                        padding: "0.65rem 1.3rem",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          isPending || !address ? "#4b5563" : "#f97316",
                        color: "white",
                        fontWeight: 600,
                        cursor:
                          isPending || !address
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      {isPending ? "Submitting..." : "Withdraw"}
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.7,
                      marginTop: "0.25rem",
                    }}
                  >
                    Tip: enter{" "}
                    <code style={{ fontFamily: "monospace" }}>
                      {formatShares(shareBalance, { min: 2, max: 6 })}
                    </code>{" "}
                    to fully close your position.
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        
        <section className="vault-card">
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.15rem" }}>
            Vault Stats
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              marginBottom: "1.25rem",
            }}
          >
            <StatRow
              label="Total assets"
              value={`${formatUsdc(totalAssets)} mUSDC`}
            />
            <StatRow
              label="Total shares"
              value={`${formatShares(totalShares)} aSHARE`}
            />
            <StatRow
              label="Share price"
              value={`${sharePrice.toFixed(8)} mUSDC`}
            />
            <StatRow
              label="Simulated APR"
              value={`${(SIMULATED_APR * 100).toFixed(1)}%`}
              hint="Demo only. Real yield may differ."
            />
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.8,
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            This is a Base Sepolia testnet vault. Use the faucet button to get
            mock mUSDC and try deposits, withdrawals, and live share pricing
            without real funds.
          </p>

          <div>
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.8,
                marginBottom: "0.35rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Demo growth (share price)</span>
              <span style={{ fontFamily: "monospace" }}>
                {sharePrice.toFixed(6)} mUSDC
              </span>
            </div>
            <GrowthChart points={demoHistory} />
          </div>
        </section>
      </main>
    </div>
  );
}



function StatColumn({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: "1.0rem", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function StatRow({ label, value, hint }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ opacity: 0.75 }}>
        {label}
        {hint && (
          <span
            style={{
              fontSize: "0.7rem",
              opacity: 0.6,
              marginLeft: "0.25rem",
            }}
          >
            ({hint})
          </span>
        )}
      </div>
      <span style={{ fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

function GrowthChart({ points }) {
  if (!points || points.length === 0) return null;

  const width = 260;
  const height = 80;
  const pad = 8;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const svgPoints = points
    .map((v, i) => {
      const x = pad + ((width - pad * 2) * i) / (points.length - 1 || 1);
      const y =
        height -
        pad -
        ((v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        borderRadius: "10px",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,64,175,0.35))",
      }}
    >
      <defs>
        <linearGradient id="vaultLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#vaultLine)"
        strokeWidth="2"
        points={svgPoints}
      />
    </svg>
  );
}