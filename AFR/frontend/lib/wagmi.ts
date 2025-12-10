import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "AFR Savings",
  projectId: "451a29b02726752d00578cc0f118786e", 
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/V92D-dctKOiuEf3nzTPTt"
    ),
  },
  ssr: false,
});