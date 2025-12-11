

import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #ff5a5f 0%, #05060b 55%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.5rem 1rem 3rem",
      }}
    >
      
      <header
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "999px",
              background:
                "conic-gradient(from 180deg at 50% 50%, #22c55e, #f97316, #facc15, #22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            AFR
          </div>
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>
            AFR Savings Vault
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <a
            href="https://github.com/softalpha0/AFR"
            target="_blank"
            rel="noreferrer"
            style={{ opacity: 0.9, textDecoration: "none", color: "white" }}
          >
            GitHub
          </a>

          
          <span style={{ opacity: 0.4 }}>Docs (coming soon)</span>

          <Link
            href="/vault"
            style={{
              padding: "0.55rem 1.2rem",
              borderRadius: "999px",
              background: "#f97316",
              color: "white",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(248, 250, 252, 0.15)",
            }}
          >
            Launch testnet app
          </Link>
        </nav>
      </header>

      
      <main
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: "2.5rem",
          alignItems: "flex-start",
        }}
      >
        
        <section>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.8,
              marginBottom: "0.8rem",
            }}
          >
            Base Sepolia testnet · mock USDC only
          </p>

          <h1
            style={{
              fontSize: "2.3rem",
              lineHeight: 1.1,
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            A simple USD savings vault
            <br />
            powered by <span style={{ color: "#f97316" }}>AFR</span>.
          </h1>

          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              opacity: 0.9,
              marginBottom: "1.25rem",
              maxWidth: "38rem",
            }}
          >
            AFR Savings Vault is a lightweight, transparent, smart
            contract–powered savings vault built to help people preserve value
            in a stable USD-denominated asset, starting with the AFR ecosystem.
            This prototype runs on Base Sepolia using mock USDC (mUSDC).
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ opacity: 0.8 }}>AFR clears DeFi complexity with:</span>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                lineHeight: 1.7,
                opacity: 0.95,
              }}
            >
              <li>Deposit USD-stable tokens (mUSDC on testnet)</li>
              <li>Receive aSHARE vault tokens</li>
              <li>Withdraw anytime — no lockups</li>
              <li>
                As the vault grows, each share becomes redeemable for more USD
              </li>
            </ul>
          </div>

          <div style={{ marginTop: "1.75rem", display: "flex", gap: "1rem" }}>
            <Link
              href="/vault"
              style={{
                padding: "0.7rem 1.4rem",
                borderRadius: "999px",
                background: "#ec4899",
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 16px 40px rgba(236, 72, 153, 0.4)",
              }}
            >
              Try the testnet vault
            </Link>
            <p
              style={{
                fontSize: "0.8rem",
                opacity: 0.7,
                maxWidth: "14rem",
              }}
            >
              No real money. You’ll use Base Sepolia ETH + mock mUSDC from the
              built-in faucet.
            </p>
          </div>
        </section>

        
        <section
          style={{
            background: "rgba(5, 6, 11, 0.9)",
            borderRadius: "18px",
            padding: "1.5rem 1.4rem",
            border: "1px solid rgba(248, 250, 252, 0.06)",
            boxShadow:
              "0 18px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(15,23,42,0.6)",
            fontSize: "0.86rem",
            lineHeight: 1.6,
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              marginBottom: "0.6rem",
            }}
          >
            Vision
          </h2>
          <p style={{ opacity: 0.85, marginBottom: "0.75rem" }}>
            Many regions experience unstable financial systems and rising
            inflation. Stablecoins and on-chain finance give people a way to
            store value. But most existing DeFi apps are complex, risky, and not
            user-friendly.
          </p>
          <p style={{ opacity: 0.85, marginBottom: "0.75rem" }}>
            AFR clears this with a simple flow: deposit, receive shares,
            withdraw any time. As the vault grows, each share is redeemable for
            more USD.
          </p>
          <p style={{ opacity: 0.85, marginBottom: "0.75rem" }}>
            Today, AFR is a testnet prototype on Base Sepolia using mock USDC
            (mUSDC). Tomorrow, AFR mainnet — an AFR app-chain rollup, and
            eventually a standalone L1 if necessary.
          </p>

          <hr
            style={{
              borderColor: "rgba(148,163,184,0.25)",
              margin: "1rem 0 0.9rem",
            }}
          />

          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Architecture Overview
          </h3>
          <p style={{ opacity: 0.85, marginBottom: "0.4rem" }}>
            <strong>SavingsVault.sol</strong> smart contract:
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.1rem",
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            <li>Accepts stablecoin deposits (mUSDC on testnet)</li>
            <li>Mints proportional vault shares (aSHARE)</li>
            <li>Handles withdrawals at any time</li>
            <li>Supports simulated yield via owner deposits</li>
            <li>Fully on-chain accounting (no oracles)</li>
          </ul>

          <p
            style={{
              marginTop: "1rem",
              opacity: 0.7,
            }}
          >
            This repo contains the smart contracts, frontend dApp, and roadmap
            for AFR.
          </p>
        </section>
      </main>
    </div>
  );
}